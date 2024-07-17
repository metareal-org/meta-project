<?php

namespace App\Console\Commands;

use App\Models\Auction;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProcessExpiredAuctions extends Command
{
    protected $signature = 'auctions:process-expired';
    protected $description = 'Process expired auctions and transfer ownership if applicable';

    public function handle()
    {
        $expiredAuctions = Auction::where('status', 'active')
            ->where('end_time', '<=', now())
            ->with(['land', 'bids'])
            ->get();

        foreach ($expiredAuctions as $auction) {
            DB::beginTransaction();
            try {
                $land = $auction->land;
                $seller = User::find($land->owner_id);
                $highestBid = $auction->highestBid();

                if ($highestBid) {
                    $highestBidder = $highestBid->user;
                    $finalPrice = $highestBid->amount;

                    $land->update([
                        'owner_id' => $highestBidder->id,
                        'is_for_sale' => false,
                        'fixed_price' => null,
                    ]);

                    $highestBidder->unlockCp($finalPrice);
                    $seller->addCp($finalPrice);

                    Transaction::create([
                        'land_id' => $land->id,
                        'seller_id' => $seller->id,
                        'buyer_id' => $highestBidder->id,
                        'price' => $finalPrice,
                        'type' => 'auction',
                    ]);

                    $this->info("Auction {$auction->id} completed. Land {$land->id} transferred to user {$highestBidder->id} for {$finalPrice} CP.");

                    $this->refundOtherBidders($auction, $highestBidder->id);
                } else {
                    $this->info("Auction {$auction->id} ended with no bids.");
                }

                $auction->update([
                    'status' => 'done',
                ]);

                DB::commit();
            } catch (\Exception $e) {
                DB::rollBack();
                Log::error("Failed to process expired auction {$auction->id}: " . $e->getMessage());
                $this->error("Failed to process auction {$auction->id}: " . $e->getMessage());
            }
        }

        $this->info('Expired auctions processed successfully.');
    }

    private function refundOtherBidders(Auction $auction, int $winningBidderId)
    {
        $otherBids = $auction->bids()->where('user_id', '!=', $winningBidderId)->get();
        foreach ($otherBids as $bid) {
            $bidder = $bid->user;
            $bidder->unlockCp($bid->amount);
            $this->info("Refunded {$bid->amount} CP to user {$bidder->id} for auction {$auction->id}.");
        }
    }
}

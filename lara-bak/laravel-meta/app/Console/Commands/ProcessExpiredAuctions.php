<?php

namespace App\Console\Commands;

use App\Models\Auction;
use App\Http\Controllers\TransactionController;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class ProcessExpiredAuctions extends Command
{
    protected $signature = 'auctions:process-expired';
    protected $description = 'Process expired auctions and update their status';

    protected $transactionController;

    public function __construct(TransactionController $transactionController)
    {
        parent::__construct();
        $this->transactionController = $transactionController;
    }

    public function handle()
    {
        $expiredAuctions = Auction::where('status', 'active')
            ->where('end_time', '<=', now())
            ->get();

        foreach ($expiredAuctions as $auction) {
            try {
                if ($auction->bids()->exists()) {
                    $auction->update(['status' => 'pending_completion']);
                    $response = $this->transactionController->completeAuctionTransaction($auction);

                    if ($response->getStatusCode() === 200) {
                        $this->info("Auction {$auction->id} completed successfully.");
                    } else {
                        $this->error("Failed to complete auction {$auction->id}: " . $response->getData()->message);
                    }
                } else {
                    $auction->update(['status' => 'ended_no_bids']);
                    $this->info("Auction {$auction->id} ended with no bids.");
                }
            } catch (\Exception $e) {
                Log::error("Error processing auction {$auction->id}: " . $e->getMessage());
                $this->error("Error processing auction {$auction->id}: " . $e->getMessage());
            }
        }

        $this->info('Expired auctions processed successfully.');
    }
}

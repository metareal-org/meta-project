<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\DB;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    protected $with = ['assets'];
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($user) {
            $lastUser = static::orderBy('id', 'desc')->first();
            $nextId = $lastUser ? $lastUser->id + 1 : 1;
            // $user->referral_code = str_pad($nextId, 10, '0', STR_PAD_LEFT);
            $user->referral_code = $nextId;
        });

        static::created(function ($user) {
            $user->assets()->create();
        });
    }


    public function ownedLands(): HasMany
    {
        return $this->hasMany(Land::class, 'owner_id');
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class, 'buyer_id');
    }

    public function offers(): HasMany
    {
        return $this->hasMany(Offer::class);
    }

    public function referrer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'referrer_id');
    }

    public function referrals(): HasMany
    {
        return $this->hasMany(User::class, 'referrer_id');
    }

    public function allReferrals(): HasMany
    {
        return $this->referrals()->with('allReferrals');
    }

    public function getReferralTreeAttribute()
    {
        return $this->allReferrals->map(function ($referral) {
            return [
                'id' => $referral->id,
                'nickname' => $referral->nickname,
                'referrals' => $referral->referralTree,
            ];
        });
    }

    public function makeOffer(Land $land, int $price): ?Offer
    {
        return $this->offers()->create([
            'land_id' => $land->id,
            'price' => $price,
        ]);
    }

    public function getCpAmountTotalAttribute(): int
    {
        return $this->cp_amount_free + $this->cp_amount_locked;
    }

    public function getMetaAmountTotalAttribute(): int
    {
        return $this->meta_amount_free + $this->meta_amount_locked;
    }

    // CP Management Methods
    public function addCp(int $amount): bool
    {
        return $this->updateCpAmount($this->cp_amount_free + $amount, $this->cp_amount_locked);
    }

    public function removeCp(int $amount): bool
    {
        $newAmount = max(0, $this->cp_amount_free - $amount);
        return $this->updateCpAmount($newAmount, $this->cp_amount_locked);
    }

    public function lockCp(int $amount): bool
    {
        if ($this->cp_amount_free < $amount) {
            return false;
        }

        return $this->updateCpAmount(
            $this->cp_amount_free - $amount,
            $this->cp_amount_locked + $amount
        );
    }

    public function unlockCp(int $amount): bool
    {
        if ($this->cp_amount_locked < $amount) {
            return false;
        }

        return $this->updateCpAmount(
            $this->cp_amount_free + $amount,
            $this->cp_amount_locked - $amount
        );
    }

    public function setExactCp(int $amount): bool
    {
        return $this->updateCpAmount($amount, $this->cp_amount_locked);
    }

    public function addMeta(int $amount): bool
    {
        return $this->updateMetaAmount($this->meta_amount_free + $amount, $this->meta_amount_locked);
    }

    public function removeMeta(int $amount): bool
    {
        $newAmount = max(0, $this->meta_amount_free - $amount);
        return $this->updateMetaAmount($newAmount, $this->meta_amount_locked);
    }

    public function lockMeta(int $amount): bool
    {
        $lockableAmount = min($amount, $this->meta_amount_free);
        return $this->updateMetaAmount(
            $this->meta_amount_free - $lockableAmount,
            $this->meta_amount_locked + $lockableAmount
        );
    }

    public function unlockMeta(int $amount): bool
    {
        $unlockableAmount = min($amount, $this->meta_amount_locked);
        return $this->updateMetaAmount(
            $this->meta_amount_free + $unlockableAmount,
            $this->meta_amount_locked - $unlockableAmount
        );
    }

    public function setExactMeta(int $amount): bool
    {
        return $this->updateMetaAmount($amount, $this->meta_amount_locked);
    }

    private function updateCpAmount(int $free, int $locked): bool
    {
        return $this->update([
            'cp_amount_free' => $free,
            'cp_amount_locked' => $locked,
        ]);
    }

    private function updateMetaAmount(int $free, int $locked): bool
    {
        return $this->update([
            'meta_amount_free' => $free,
            'meta_amount_locked' => $locked,
        ]);
    }

    // Transaction methods
    public function transferCp(User $recipient, int $amount): bool
    {
        if ($this->cp_amount_free < $amount) {
            return false;
        }

        return DB::transaction(function () use ($recipient, $amount) {
            $this->removeCp($amount);
            $recipient->addCp($amount);
            return true;
        });
    }

    public function transferMeta(User $recipient, int $amount): bool
    {
        if ($this->meta_amount_free < $amount) {
            return false;
        }

        return DB::transaction(function () use ($recipient, $amount) {
            $this->removeMeta($amount);
            $recipient->addMeta($amount);
            return true;
        });
    }

    public function hasSufficientCp(int $amount): bool
    {
        return $this->cp_amount_free >= $amount;
    }

    public function hasSufficientMeta(int $amount): bool
    {
        return $this->meta_amount_free >= $amount;
    }

    public function applyReferral(string $referralCode): bool
    {
        if ($this->referrer_id) {
            return false; // User already has a referrer
        }

        $referrer = User::where('referral_code', $referralCode)->first();
        if (!$referrer || $referrer->id === $this->id) {
            return false; // Invalid referral code or self-referral
        }

        $this->referrer_id = $referrer->id;
        return $this->save();
    }
    public function assets()
    {
        return $this->hasOne(Asset::class);
    }
    public function getAssetsDataAttribute()
    {
        return $this->assets;
    }

    public function updateAsset(string $assetType, int $amount): bool
    {
        if (!$this->assets) {
            return false;
        }

        $currentAmount = $this->assets->$assetType;
        $newAmount = max(0, $currentAmount + $amount);

        return $this->assets->update([$assetType => $newAmount]);
    }

    public function setAssetExact(string $assetType, int $amount): bool
    {
        if (!$this->assets) {
            return false;
        }

        return $this->assets->update([$assetType => max(0, $amount)]);
    }

    public function userRewards()
    {
        return $this->hasMany(UserReward::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\DB;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $with = ['assets'];

    protected $fillable = [
        'id',
        'address',
        'nickname',
        'avatar_url',
        'coordinates',
        'current_mission',
        'referrer_id',
        'referral_code',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($user) {
            if ($user->id === 1 && $user->nickname !== 'Bank') {
                throw new \Exception('User with ID 1 is reserved for the bank.');
            }

            if ($user->id !== 1) {
                $lastUser = static::where('id', '>', 1)->orderBy('id', 'desc')->first();
                $nextId = $lastUser ? $lastUser->id + 1 : 2; // Start from 2 if no other users exist
                $user->id = $nextId;
                $user->referral_code = $nextId;
            }
        });

        static::created(function ($user) {
            $assetTypes = ['cp', 'cp_locked', 'meta', 'meta_locked', 'bnb', 'bnb_locked', 'iron', 'wood', 'sand', 'gold', 'ticket', 'giftbox', 'chest_silver', 'chest_gold', 'chest_diamond', 'scratch_box'];

            foreach ($assetTypes as $type) {
                $user->assets()->create([
                    'type' => $type,
                    'amount' => 0,
                ]);
            }
        });
    }

    public static function getBank()
    {
        $bank = self::firstOrCreate(
            ['id' => 1],
            [
                'address' => '0x0000000000000000000000000000000000000000',
                'nickname' => 'Bank',
                'avatar_url' => null,
                'coordinates' => null,
                'current_mission' => 0,
                'referral_code' => 'BANK',
            ]
        );

        // Create initial assets for the bank if they don't exist
        $assetTypes = ['cp', 'cp_locked', 'meta', 'meta_locked', 'iron', 'wood', 'sand', 'gold', 'ticket', 'giftbox', 'chest_silver', 'chest_gold', 'chest_diamond', 'scratch_box'];

        foreach ($assetTypes as $type) {
            $bank->assets()->firstOrCreate(['type' => $type], ['amount' => 0]);
        }

        return $bank;
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

    public function getCpAttribute()
    {
        $cpFree = $this->assets->firstWhere('type', 'cp')->amount ?? 0;
        $cpLocked = $this->assets->firstWhere('type', 'cp_locked')->amount ?? 0;
        return [
            'free' => $cpFree,
            'locked' => $cpLocked,
            'total' => $cpFree + $cpLocked,
        ];
    }

    public function getMetaAttribute()
    {
        $metaFree = $this->assets->firstWhere('type', 'meta')->amount ?? 0;
        $metaLocked = $this->assets->firstWhere('type', 'meta_locked')->amount ?? 0;
        return [
            'free' => $metaFree,
            'locked' => $metaLocked,
            'total' => $metaFree + $metaLocked,
        ];
    }

    public function lockCp(int $amount): bool
    {
        $cpAsset = $this->assets->firstWhere('type', 'cp');
        $cpLockedAsset = $this->assets->firstWhere('type', 'cp_locked');
        if (!$cpAsset || !$cpLockedAsset || $cpAsset->amount < $amount) {
            return false;
        }
        return DB::transaction(function () use ($cpAsset, $cpLockedAsset, $amount) {
            $cpAsset->amount -= $amount;
            $cpLockedAsset->amount += $amount;
            return $cpAsset->save() && $cpLockedAsset->save();
        });
    }

    public function unlockCp(int $amount): bool
    {
        $cpAsset = $this->assets->firstWhere('type', 'cp');
        $cpLockedAsset = $this->assets->firstWhere('type', 'cp_locked');
        if (!$cpAsset || !$cpLockedAsset || $cpLockedAsset->amount < $amount) {
            return false;
        }
        return DB::transaction(function () use ($cpAsset, $cpLockedAsset, $amount) {
            $cpAsset->amount += $amount;
            $cpLockedAsset->amount -= $amount;
            return $cpAsset->save() && $cpLockedAsset->save();
        });
    }

    public function lockMeta(int $amount): bool
    {
        $metaAsset = $this->assets->firstWhere('type', 'meta');
        $metaLockedAsset = $this->assets->firstWhere('type', 'meta_locked');
        if (!$metaAsset || !$metaLockedAsset || $metaAsset->amount < $amount) {
            return false;
        }
        return DB::transaction(function () use ($metaAsset, $metaLockedAsset, $amount) {
            $metaAsset->amount -= $amount;
            $metaLockedAsset->amount += $amount;
            return $metaAsset->save() && $metaLockedAsset->save();
        });
    }

    public function unlockMeta(int $amount): bool
    {
        $metaAsset = $this->assets->firstWhere('type', 'meta');
        $metaLockedAsset = $this->assets->firstWhere('type', 'meta_locked');
        if (!$metaAsset || !$metaLockedAsset || $metaLockedAsset->amount < $amount) {
            return false;
        }
        return DB::transaction(function () use ($metaAsset, $metaLockedAsset, $amount) {
            $metaAsset->amount += $amount;
            $metaLockedAsset->amount -= $amount;
            return $metaAsset->save() && $metaLockedAsset->save();
        });
    }

    public function addCp(int $amount): bool
    {
        $cpAsset = $this->assets->firstWhere('type', 'cp');
        if (!$cpAsset) {
            return false;
        }
        $cpAsset->amount += $amount;
        return $cpAsset->save();
    }

    public function removeCp(int $amount): bool
    {
        $cpAsset = $this->assets->firstWhere('type', 'cp');
        if (!$cpAsset || $cpAsset->amount < $amount) {
            return false;
        }
        $cpAsset->amount -= $amount;
        return $cpAsset->save();
    }

    public function addMeta(int $amount): bool
    {
        $metaAsset = $this->assets->firstWhere('type', 'meta');
        if (!$metaAsset) {
            return false;
        }
        $metaAsset->amount += $amount;
        return $metaAsset->save();
    }

    public function removeMeta(int $amount): bool
    {
        $metaAsset = $this->assets->firstWhere('type', 'meta');
        if (!$metaAsset || $metaAsset->amount < $amount) {
            return false;
        }
        $metaAsset->amount -= $amount;
        return $metaAsset->save();
    }

    public function transferCp(User $recipient, int $amount): bool
    {
        return DB::transaction(function () use ($recipient, $amount) {
            if (!$this->removeCp($amount)) {
                return false;
            }
            return $recipient->addCp($amount);
        });
    }

    public function transferMeta(User $recipient, int $amount): bool
    {
        return DB::transaction(function () use ($recipient, $amount) {
            if (!$this->removeMeta($amount)) {
                return false;
            }
            return $recipient->addMeta($amount);
        });
    }

    public function hasSufficientCp(int $amount): bool
    {
        return ($this->assets->firstWhere('type', 'cp')->amount ?? 0) >= $amount;
    }

    public function hasSufficientMeta(int $amount): bool
    {
        return ($this->assets->firstWhere('type', 'meta')->amount ?? 0) >= $amount;
    }

    public function applyReferral(string $referralCode): bool
    {
        if ($this->referrer_id) {
            return false;
        }

        $referrer = User::where('referral_code', $referralCode)->first();
        if (!$referrer || $referrer->id === $this->id) {
            return false;
        }

        $this->referrer_id = $referrer->id;
        return $this->save();
    }

    public function assets()
    {
        return $this->hasMany(Asset::class);
    }

    public function getAssetsDataAttribute()
    {
        return $this->assets->keyBy('type')->map(function ($asset) {
            return $asset->amount;
        });
    }

    public function updateAsset(string $assetType, int $amount): bool
    {
        $asset = $this->assets->firstWhere('type', $assetType);
        if (!$asset) {
            return false;
        }
        $asset->amount = max(0, $asset->amount + $amount);
        return $asset->save();
    }

    public function setAssetExact(string $assetType, int $amount): bool
    {
        $asset = $this->assets->firstWhere('type', $assetType);
        if (!$asset) {
            return false;
        }
        $asset->amount = max(0, $amount);
        return $asset->save();
    }

    public function userRewards()
    {
        return $this->hasMany(UserReward::class);
    }

    public function quests(): BelongsToMany
    {
        return $this->belongsToMany(Quest::class, 'user_quests')
            ->withPivot('completed_at')
            ->withTimestamps();
    }


    public function getBnbAttribute()
    {
        $bnbFree = $this->assets->firstWhere('type', 'bnb')->amount ?? 0;
        $bnbLocked = $this->assets->firstWhere('type', 'bnb_locked')->amount ?? 0;
        return [
            'free' => $bnbFree,
            'locked' => $bnbLocked,
            'total' => $bnbFree + $bnbLocked,
        ];
    }

    public function lockBnb(int $amount): bool
    {
        $bnbAsset = $this->assets->firstWhere('type', 'bnb');
        $bnbLockedAsset = $this->assets->firstWhere('type', 'bnb_locked');
        if (!$bnbAsset || !$bnbLockedAsset || $bnbAsset->amount < $amount) {
            return false;
        }
        return DB::transaction(function () use ($bnbAsset, $bnbLockedAsset, $amount) {
            $bnbAsset->amount -= $amount;
            $bnbLockedAsset->amount += $amount;
            return $bnbAsset->save() && $bnbLockedAsset->save();
        });
    }

    public function unlockBnb(int $amount): bool
    {
        $bnbAsset = $this->assets->firstWhere('type', 'bnb');
        $bnbLockedAsset = $this->assets->firstWhere('type', 'bnb_locked');
        if (!$bnbAsset || !$bnbLockedAsset || $bnbLockedAsset->amount < $amount) {
            return false;
        }
        return DB::transaction(function () use ($bnbAsset, $bnbLockedAsset, $amount) {
            $bnbAsset->amount += $amount;
            $bnbLockedAsset->amount -= $amount;
            return $bnbAsset->save() && $bnbLockedAsset->save();
        });
    }

    public function addBnb(int $amount): bool
    {
        $bnbAsset = $this->assets->firstWhere('type', 'bnb');
        if (!$bnbAsset) {
            return false;
        }
        $bnbAsset->amount += $amount;
        return $bnbAsset->save();
    }

    public function removeBnb(int $amount): bool
    {
        $bnbAsset = $this->assets->firstWhere('type', 'bnb');
        if (!$bnbAsset || $bnbAsset->amount < $amount) {
            return false;
        }
        $bnbAsset->amount -= $amount;
        return $bnbAsset->save();
    }

    public function transferBnb(User $recipient, int $amount): bool
    {
        return DB::transaction(function () use ($recipient, $amount) {
            if (!$this->removeBnb($amount)) {
                return false;
            }
            return $recipient->addBnb($amount);
        });
    }

    public function hasSufficientBnb(int $amount): bool
    {
        return ($this->assets->firstWhere('type', 'bnb')->amount ?? 0) >= $amount;
    }
}

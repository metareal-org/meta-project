# Create directories if they don't exist
New-Item -ItemType Directory -Force -Path "database/migrations"
New-Item -ItemType Directory -Force -Path "app/Models"

# Create migration files
$timestamp = Get-Date -Format "yyyy_MM_dd_HHmmss"

$landsMigrationContent = @"
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lands', function (Blueprint `$table) {
            `$table->id();
            `$table->integer('fid');
            `$table->json('coordinates');
            `$table->string('full_id')->nullable();
            `$table->integer('owner_id')->nullable()->default(0);
            `$table->integer('fixed_price')->nullable()->default(0);
            `$table->boolean('is_for_sale')->nullable()->default(false);
            `$table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lands');
    }
};
"@

$usersMigrationContent = @"
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint `$table) {
            `$table->id();
            `$table->string('address')->unique();
            `$table->string('nickname')->nullable();
            `$table->string('avatar_url')->nullable();
            `$table->integer('cp_amount')->nullable()->default(0);
            `$table->integer('meta_amount')->nullable()->default(0);
            `$table->json('coordinates')->nullable();
            `$table->integer('current_mission')->default(0);
            `$table->rememberToken();
            `$table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
"@

$transactionsAndOffersMigrationContent = @"
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint `$table) {
            `$table->id();
            `$table->foreignId('land_id')->constrained();
            `$table->foreignId('seller_id')->constrained('users');
            `$table->foreignId('buyer_id')->constrained('users');
            `$table->integer('price');
            `$table->timestamps();
        });

        Schema::create('offers', function (Blueprint `$table) {
            `$table->id();
            `$table->foreignId('land_id')->constrained();
            `$table->foreignId('user_id')->constrained();
            `$table->integer('price');
            `$table->boolean('is_accepted')->default(false);
            `$table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('offers');
        Schema::dropIfExists('transactions');
    }
};
"@

Set-Content -Path "database/migrations/${timestamp}_create_lands_table.php" -Value $landsMigrationContent
Set-Content -Path "database/migrations/${timestamp}_create_users_table.php" -Value $usersMigrationContent
Set-Content -Path "database/migrations/${timestamp}_create_transactions_and_offers_tables.php" -Value $transactionsAndOffersMigrationContent

# Create model files
$landModelContent = @"
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Land extends Model
{
    protected `$fillable = [
        'fid', 'coordinates', 'full_id', 'owner_id', 'fixed_price', 'is_for_sale',
    ];

    protected `$casts = [
        'coordinates' => 'array',
        'is_for_sale' => 'boolean',
    ];

    public function owner(): BelongsTo
    {
        return `$this->belongsTo(User::class, 'owner_id');
    }

    public function transactions(): HasMany
    {
        return `$this->hasMany(Transaction::class);
    }

    public function offers(): HasMany
    {
        return `$this->hasMany(Offer::class);
    }
}
"@

$userModelContent = @"
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected `$fillable = [
        'address', 'nickname', 'avatar_url', 'cp_amount', 'meta_amount', 'coordinates', 'current_mission',
    ];

    protected `$hidden = [
        'remember_token',
    ];

    protected `$casts = [
        'coordinates' => 'array',
    ];

    public function ownedLands(): HasMany
    {
        return `$this->hasMany(Land::class, 'owner_id');
    }

    public function transactions(): HasMany
    {
        return `$this->hasMany(Transaction::class, 'buyer_id');
    }

    public function offers(): HasMany
    {
        return `$this->hasMany(Offer::class);
    }
}
"@

$transactionModelContent = @"
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    protected `$fillable = [
        'land_id', 'seller_id', 'buyer_id', 'price',
    ];

    public function land(): BelongsTo
    {
        return `$this->belongsTo(Land::class);
    }

    public function seller(): BelongsTo
    {
        return `$this->belongsTo(User::class, 'seller_id');
    }

    public function buyer(): BelongsTo
    {
        return `$this->belongsTo(User::class, 'buyer_id');
    }
}
"@

$offerModelContent = @"
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Offer extends Model
{
    protected `$fillable = [
        'land_id', 'user_id', 'price', 'is_accepted',
    ];

    protected `$casts = [
        'is_accepted' => 'boolean',
    ];

    public function land(): BelongsTo
    {
        return `$this->belongsTo(Land::class);
    }

    public function user(): BelongsTo
    {
        return `$this->belongsTo(User::class);
    }
}
"@

Set-Content -Path "app/Models/Land.php" -Value $landModelContent
Set-Content -Path "app/Models/User.php" -Value $userModelContent
Set-Content -Path "app/Models/Transaction.php" -Value $transactionModelContent
Set-Content -Path "app/Models/Offer.php" -Value $offerModelContent

Write-Host "All files have been created successfully."
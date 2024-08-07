# API Documentation

## Table of Contents
1. [User Management](#user-management)
2. [Asset Management](#asset-management)
3. [Auction Management](#auction-management)
4. [Offer Management](#offer-management)
5. [Transaction Management](#transaction-management)
6. [Currency Management](#currency-management)
7. [Quest Management](#quest-management)
8. [Land Management](#land-management)
9. [Land Version Management](#land-version-management)
10. [Scratch Box Management](#scratch-box-management)
11. [Asset Listing Management](#asset-listing-management)

## User Management

### Authenticate User

| Route | POST /user/authenticate |
|-------|-------------------------|
| Arguments | address, message, signature |
| Logic | Authenticate user using signature or token |
| Output | User data and access token |

The authentication process involves two methods:
1. Token-based authentication: If a bearer token is provided, verify its validity and match it with the provided address.
2. Signature-based authentication: If no token is provided, verify the signature against the provided message and address. If valid, create or retrieve the user account and generate a new access token.

The function should check for token expiration and handle token refresh if necessary. Upon successful authentication, it should return user data along with a new or existing access token.

### Show User Profile

| Route | GET /user/show |
|-------|-----------------|
| Arguments | None (uses authenticated user) |
| Logic | Retrieve and return user profile data |
| Output | User profile data |

This endpoint retrieves the profile data of the authenticated user. It should include all relevant user information such as nickname, avatar URL, current mission, and any other user-specific data stored in the system.

### Update User Profile

| Route | POST /user/update |
|-------|-------------------|
| Arguments | current_mission, avatar_url, coordinates, nickname |
| Logic | Update user profile with provided data |
| Output | Updated user profile data |

This function updates the authenticated user's profile with the provided data. It should validate the input data, ensure that the nickname is between 3 and 80 characters, and update only the fields that are provided in the request.

### User Logout

| Route | POST /user/logout |
|-------|-------------------|
| Arguments | None (uses authenticated user) |
| Logic | Invalidate the current user's access token |
| Output | Success message |

This endpoint invalidates the current user's access token, effectively logging them out of the system. It should ensure that the token can no longer be used for authentication.

### Apply Referral Code

| Route | POST /user/apply-referral |
|-------|---------------------------|
| Arguments | referral_code |
| Logic | Apply referral code to user account |
| Output | Success status and message |

This function applies a referral code to the authenticated user's account. It should check if the user has already applied a referral code, verify the validity of the provided code, and update both the inviter's and the invited user's accounts accordingly. The process includes:
1. Checking if the user has already applied a referral code.
2. Finding the inviter user based on the referral code.
3. Updating the inviter's CP (Crypto Points) by adding 1000.
4. Updating the invited user's CP by adding 500.
5. Setting the referrer_id for the invited user.

### Get Referral Tree

| Route | GET /user/referral-tree |
|-------|--------------------------|
| Arguments | None (uses authenticated user) |
| Logic | Retrieve the user's referral tree |
| Output | Hierarchical structure of user's referrals |

This endpoint retrieves the hierarchical structure of the authenticated user's referrals. It should return a tree-like structure showing all direct referrals and their subsequent referrals, creating a multi-level representation of the user's referral network.

### Get Referral Code

| Route | GET /user/referral-code |
|-------|--------------------------|
| Arguments | None (uses authenticated user) |
| Logic | Retrieve the user's referral code |
| Output | User's referral code |

This function returns the referral code associated with the authenticated user's account. This code can be shared with others to invite them to the platform.

## Asset Management

### Get User Assets

| Route | GET /assets |
|-------|-------------|
| Arguments | None (uses authenticated user) |
| Logic | Retrieve all assets owned by the user |
| Output | List of user's assets with quantities |

This endpoint retrieves a list of all assets owned by the authenticated user. It should return an array of asset types and their corresponding quantities.

### Update Asset

| Route | POST /assets/update |
|-------|---------------------|
| Arguments | asset_type, amount, action |
| Logic | Update the quantity of a specific asset for the user |
| Output | Updated asset information |

This function updates the quantity of a specific asset for the authenticated user. The `action` parameter determines whether to increase, decrease, lock, unlock, or set an exact amount for the asset. It should validate the action and ensure that the user has sufficient assets for decrease or lock operations.

## Auction Management

### Create Auction

| Route | POST /auctions/create |
|-------|------------------------|
| Arguments | land_id, minimum_price, duration |
| Logic | Create a new auction for a specified land |
| Output | Created auction details |

This endpoint creates a new auction for a specified land. It should:
1. Verify that the authenticated user owns the land.
2. Check if the land is eligible for auction (not already for sale or in another active auction).
3. Create an auction with the specified minimum price and duration.
4. Set the end time based on the current time plus the specified duration.

### Place Bid

| Route | POST /auctions/{auctionId}/bid |
|-------|--------------------------------|
| Arguments | amount |
| Logic | Place a bid on an active auction |
| Output | Updated auction and bid information |

This function allows a user to place a bid on an active auction. It should:
1. Verify that the auction is active and not expired.
2. Ensure the bid amount is higher than the current highest bid or the minimum price.
3. Lock the bid amount in the user's account.
4. Create a new bid record.
5. Update the auction with the new highest bid information.

### Get Bids for Auction

| Route | GET /auctions/{auctionId}/bids |
|-------|--------------------------------|
| Arguments | None |
| Logic | Retrieve all bids for a specific auction |
| Output | List of bids with user information |

This endpoint retrieves all bids placed on a specific auction. It should return a list of bids, including the bid amount, the user who placed the bid, and the time the bid was placed.

### Cancel Auction

| Route | POST /auctions/{auctionId}/cancel |
|-------|-----------------------------------|
| Arguments | None (uses authenticated user) |
| Logic | Cancel an active auction |
| Output | Success message |

This function allows the owner of an auction to cancel it. It should:
1. Verify that the authenticated user is the owner of the auction.
2. Check if the auction is still active and has no bids.
3. Cancel the auction and update its status.
4. Release any locked assets or funds related to the auction.

### Process Auctions

| Route | GET /auctions/process |
|-------|------------------------|
| Arguments | None |
| Logic | Process all ended auctions |
| Output | Summary of processed auctions |

This endpoint processes all ended auctions. It should:
1. Identify all auctions that have ended.
2. For each ended auction:
   a. If there are bids, transfer ownership of the land to the highest bidder and process the payment.
   b. If there are no bids, update the land status accordingly.
3. Update the status of processed auctions.
4. Release locked funds for unsuccessful bids.

## Offer Management

### Get Offers for Land

| Route | GET /offers/{landId} |
|-------|----------------------|
| Arguments | None |
| Logic | Retrieve all offers for a specific land |
| Output | List of offers with user information |

This endpoint retrieves all offers made for a specific land. It should return a list of offers, including the offer amount, the user who made the offer, and the offer status.

### Get User's Offers

| Route | POST /offers/user |
|-------|-------------------|
| Arguments | None (uses authenticated user) |
| Logic | Retrieve all offers made by the user |
| Output | List of user's offers with land information |

This function retrieves all offers made by the authenticated user. It should return a list of the user's offers, including the offer amount, the land details for each offer, and the current status of the offer.

### Submit Offer

| Route | POST /offers/submit |
|-------|---------------------|
| Arguments | land_id, price |
| Logic | Submit a new offer for a land |
| Output | Created offer details |

This endpoint allows a user to submit a new offer for a land. It should:
1. Verify that the user has sufficient funds to make the offer.
2. Create a new offer record with the specified price for the land.
3. Lock the offered amount in the user's account.

### Delete Offer

| Route | POST /offers/delete/{offerId} |
|-------|-------------------------------|
| Arguments | None (uses authenticated user) |
| Logic | Delete an existing offer |
| Output | Success message |

This function allows a user to delete their own offer. It should:
1. Verify that the authenticated user is the owner of the offer.
2. Delete the offer record.
3. Unlock the previously locked funds in the user's account.

### Update Offer

| Route | POST /offers/update/{offerId} |
|-------|-------------------------------|
| Arguments | price |
| Logic | Update an existing offer |
| Output | Updated offer details |

This endpoint allows a user to update the price of their existing offer. It should:
1. Verify that the authenticated user is the owner of the offer.
2. Update the offer price.
3. Adjust the locked funds in the user's account based on the new price.

## Transaction Management

### Buy Land

| Route | POST /lands/{id}/buy |
|-------|----------------------|
| Arguments | None (uses authenticated user) |
| Logic | Purchase a land at its fixed price |
| Output | Transaction details and updated land ownership |

This function allows a user to purchase a land at its fixed price. It should:
1. Verify that the land is for sale and the price is set.
2. Check if the user has sufficient funds for the purchase.
3. Transfer ownership of the land to the buyer.
4. Process the payment from buyer to seller.
5. Create a transaction record.
6. Cancel any existing offers for this land.

### Accept Offer

| Route | POST /offers/accept/{offerId} |
|-------|-------------------------------|
| Arguments | None (uses authenticated user) |
| Logic | Accept an offer for a land |
| Output | Transaction details and updated land ownership |

This endpoint allows a land owner to accept an offer. It should:
1. Verify that the authenticated user is the owner of the land.
2. Process the payment from the offer maker to the land owner.
3. Transfer ownership of the land to the offer maker.
4. Create a transaction record.
5. Update the offer status to accepted.
6. Cancel all other offers for this land.

## Currency Management

### Get Balance

| Route | GET /currency/{userId}/{type} |
|-------|-------------------------------|
| Arguments | None |
| Logic | Retrieve the balance of a specific currency type for a user |
| Output | Currency balance information |

This function retrieves the balance of a specific currency type (e.g., CP, META, BNB) for a given user. It should return the total amount and the amount that is currently locked.

### Lock Currency

| Route | POST /currency/lock |
|-------|---------------------|
| Arguments | user_id, type, amount |
| Logic | Lock a specified amount of currency for a user |
| Output | Updated currency balance |

This endpoint locks a specified amount of currency for a user. It should:
1. Verify that the user has sufficient unlocked funds of the specified type.
2. Move the specified amount from unlocked to locked status.
3. Return the updated balance information.

### Unlock Currency

| Route | POST /currency/unlock |
|-------|------------------------|
| Arguments | user_id, type, amount |
| Logic | Unlock a specified amount of currency for a user |
| Output | Updated currency balance |

This function unlocks a specified amount of previously locked currency for a user. It should:
1. Verify that the user has sufficient locked funds of the specified type.
2. Move the specified amount from locked to unlocked status.
3. Return the updated balance information.

### Add Currency

| Route | POST /currency/add |
|-------|---------------------|
| Arguments | user_id, type, amount |
| Logic | Add a specified amount of currency to a user's balance |
| Output | Updated currency balance |

This endpoint adds a specified amount of currency to a user's balance. It should:
1. Increase the user's balance of the specified currency type by the given amount.
2. Return the updated balance information.

### Subtract Currency

| Route | POST /currency/subtract |
|-------|--------------------------|
| Arguments | user_id, type, amount |
| Logic | Subtract a specified amount of currency from a user's balance |
| Output | Updated currency balance |

This function subtracts a specified amount of currency from a user's balance. It should:
1. Verify that the user has sufficient funds of the specified type.
2. Decrease the user's balance of the specified currency type by the given amount.
3. Return the updated balance information.

## Quest Management

### Get All Quests

| Route | GET /quests |
|-------|-------------|
| Arguments | None |
| Logic | Retrieve all available quests |
| Output | List of all quests |

This endpoint retrieves a list of all quests available in the system. It should return detailed information about each quest, including its title, description, rewards, and any associated costs.

### Get Specific Quest

| Route | GET /quests/{quest} |
|-------|---------------------|
| Arguments | None |
| Logic | Retrieve details of a specific quest |
| Output | Detailed information about the quest |

This function retrieves detailed information about a specific quest. It should return all relevant data about the quest, including its current status and any user-specific progress if applicable.

### Create Quest

| Route | POST /quests |
|-------|--------------|
| Arguments | title, description, rewards, costs |
| Logic | Create a new quest |
| Output | Created quest details |

This endpoint creates a new quest in the system. It should:
1. Validate the input data for the quest.
2. Create a new quest record with the provided information.
3. Return the details of the newly created quest.

### Update Quest

| Route | PUT /quests/{quest} |
|-------|---------------------|
| Arguments | title, description, rewards, costs |
| Logic | Update an existing quest |
| Output | Updated quest details |

This function updates an existing quest with new information. It should:
1. Validate the input data for the quest.
2. Update the specified quest with the provided information.
3. Return the details of the updated quest.

### Delete Quest

| Route | DELETE /quests/{quest} |
|-------|------------------------|
| Arguments | None |
| Logic | Delete an existing quest |
| Output | Success message |

This endpoint deletes an existing quest from the system. It should remove the quest record and any associated data, ensuring that it's no longer available or visible in the system.

### Complete Quest

| Route | POST /quests/complete |
|-------|------------------------|
| Arguments | quest_id |
| Logic | Mark a quest as completed for the user |
| Output | Completion status and rewards |

This function marks a specific quest as completed for the authenticated user. It should:
1. Verify that the user hasn't already completed this quest.
2. Check and deduct any costs associated with the quest.
3. Mark the quest as completed for the user.
4. Award the specified rewards to the user.
5. Return the completion status and details of the awarded rewards.

### Get User Quests

| Route | GET /user/quests |
|-------|-------------------|
| Arguments | None (uses authenticated user) |
| Logic | Retrieve all quests associated with the user |
| Output | List of user's quests and their statuses |

This endpoint retrieves all quests that are associated with the authenticated user. It should return a list of quests, including their completion status and any progress information.

### Get Available Quests

| Route | GET /user/available-quests |
|-------|----------------------------|
| Arguments | None (uses authenticated user) |
| Logic | Retrieve all quests available to the user |
| Output | List of available quests |

This function retrieves all quests that are available for the authenticated user to complete. It should exclude any
quests that the user has already completed.

## Land Management

### Get Lands

| Route | GET /lands |
|-------|------------|
| Arguments | bounds, zoom |
| Logic | Retrieve lands within specified bounds and zoom level |
| Output | List of lands with owner information |

This endpoint retrieves lands within the specified geographical bounds and zoom level. It should:
1. Validate that the zoom level is at or above the minimum required level.
2. Query lands that fall within the specified latitude and longitude bounds.
3. Limit the number of returned lands based on the zoom level to optimize performance.
4. Include basic owner information for each land.

### Get All Lands

| Route | GET /lands/all |
|-------|----------------|
| Arguments | None |
| Logic | Retrieve all lands in the system |
| Output | List of all lands |

This function retrieves all lands stored in the system. Due to the potentially large amount of data, this should be used cautiously and may require pagination or other optimization techniques.

### Get User Lands

| Route | GET /lands/user |
|-------|-----------------|
| Arguments | None (uses authenticated user) |
| Logic | Retrieve all lands owned by the user |
| Output | List of user's owned lands |

This endpoint retrieves all lands owned by the authenticated user. It should return detailed information about each land, including its location, size, and any other relevant attributes.

### Get Specific Land

| Route | GET /lands/{id} |
|-------|-----------------|
| Arguments | None |
| Logic | Retrieve detailed information about a specific land |
| Output | Detailed land information including transactions, offers, and active auctions |

This function retrieves detailed information about a specific land. It should include:
1. Basic land attributes (location, size, etc.)
2. Owner information
3. Transaction history
4. Current offers
5. Active auction details (if any)
6. Any other relevant metadata

### Set Land Price

| Route | POST /lands/{id}/set-price |
|-------|----------------------------|
| Arguments | price |
| Logic | Set a fixed price for a land |
| Output | Updated land information |

This endpoint allows the owner of a land to set a fixed price for it. It should:
1. Verify that the authenticated user is the owner of the land.
2. Validate the price (e.g., ensure it's within acceptable range).
3. Update the land's fixed price.
4. Return the updated land information.

### Update Land Price

| Route | POST /lands/{id}/update-price |
|-------|--------------------------------|
| Arguments | price |
| Logic | Update the fixed price of a land |
| Output | Updated land information |

This function allows the owner to update the fixed price of their land. It should follow the same steps as the set-price endpoint, but for an already priced land.

### Cancel Land Sale

| Route | POST /lands/{id}/cancel-sell |
|-------|------------------------------|
| Arguments | None (uses authenticated user) |
| Logic | Remove the fixed price of a land, taking it off the market |
| Output | Updated land information |

This endpoint allows the owner to remove the fixed price of their land, effectively taking it off the market. It should:
1. Verify that the authenticated user is the owner of the land.
2. Set the fixed price to null or a value indicating it's not for sale.
3. Return the updated land information.

### Get Marketplace Lands

| Route | GET /marketplace/lands |
|-------|------------------------|
| Arguments | per_page, sort_by, sort_order, user_lands_only, for_sale, search |
| Logic | Retrieve lands available in the marketplace |
| Output | Paginated list of lands matching the criteria |

This function retrieves lands available in the marketplace based on various criteria. It should:
1. Apply filters based on the provided arguments (e.g., only user's lands, only for sale).
2. Sort the results as specified.
3. Implement search functionality if a search term is provided.
4. Paginate the results for efficient data transfer.
5. Return the lands along with pagination metadata.

## Land Version Management

### Import Land Version

| Route | POST /admin/lands/import |
|-------|--------------------------|
| Arguments | file, file_name, version_name |
| Logic | Import a new version of land data |
| Output | Success message |

This endpoint allows importing a new version of land data. It should:
1. Validate the uploaded file (ensure it's a valid GeoJSON).
2. Parse the file and store the land data.
3. Create a new land version record with the provided metadata.

### Get Land Versions

| Route | GET /admin/lands/versions |
|-------|---------------------------|
| Arguments | None |
| Logic | Retrieve all land versions |
| Output | List of land versions with metadata |

This function retrieves all land versions stored in the system. It should return a list of versions, including their metadata such as file name, version name, active status, and creation date.

### Toggle Version Active Status

| Route | POST /admin/lands/toggle-active/{id} |
|-------|--------------------------------------|
| Arguments | None |
| Logic | Toggle the active status of a land version |
| Output | Updated version status |

This endpoint toggles the active status of a specific land version. It should:
1. Change the active status of the specified version.
2. If activating a version, update the main lands table with the data from this version.
3. Return the updated status of the version.

### Get Specific Version

| Route | GET /admin/lands/versions/{id} |
|-------|--------------------------------|
| Arguments | None |
| Logic | Retrieve details of a specific land version |
| Output | Detailed version information |

This function retrieves detailed information about a specific land version, including its full data content.

### Update Active Versions

| Route | POST /admin/lands/update-active-versions |
|-------|------------------------------------------|
| Arguments | active_versions (array of version IDs) |
| Logic | Update which land versions are active |
| Output | Success message |

This endpoint updates which land versions are considered active. It should:
1. Set all versions not in the provided list as inactive.
2. Set all versions in the provided list as active.
3. Update the main lands table with data from all active versions.

### Delete Version

| Route | DELETE /admin/lands/versions/{id} |
|-------|-----------------------------------|
| Arguments | None |
| Logic | Delete a specific land version |
| Output | Success message |

This function deletes a specific land version. If the version was active, it should also update the main lands table accordingly.

### Lock Lands

| Route | POST /admin/lands/lock/{id} |
|-------|----------------------------|
| Arguments | None |
| Logic | Lock all lands in a specific version |
| Output | Number of affected lands |

This endpoint locks all lands associated with a specific version. It should:
1. Identify all lands from the specified version.
2. Set these lands as locked (preventing them from being sold or modified).
3. Return the number of lands affected.

### Unlock Lands

| Route | POST /admin/lands/unlock/{id} |
|-------|--------------------------------|
| Arguments | None |
| Logic | Unlock all lands in a specific version |
| Output | Number of affected lands |

This function unlocks all lands associated with a specific version, reversing the lock operation.

## Scratch Box Management

### Get Scratch Boxes

| Route | GET /scratch-boxes |
|-------|---------------------|
| Arguments | None (uses authenticated user) |
| Logic | Retrieve available and owned scratch boxes |
| Output | Lists of available and owned scratch boxes |

This endpoint retrieves two lists of scratch boxes:
1. Available scratch boxes that can be purchased.
2. Scratch boxes owned by the authenticated user.

It should include relevant details for each scratch box, such as price, status, and contents (if opened).

### Get Available Scratch Boxes

| Route | GET /scratch-boxes/available |
|-------|------------------------------|
| Arguments | None |
| Logic | Retrieve all available scratch boxes |
| Output | List of available scratch boxes |

This function retrieves all scratch boxes that are available for purchase. It should include details such as price and any visible contents.

### Get Owned Scratch Boxes

| Route | GET /scratch-boxes/owned |
|-------|--------------------------|
| Arguments | None (uses authenticated user) |
| Logic | Retrieve scratch boxes owned by the user |
| Output | List of user's owned scratch boxes |

This endpoint retrieves all scratch boxes owned by the authenticated user, including both unopened and opened boxes.

### Buy Scratch Box

| Route | POST /scratch-boxes/{id}/buy |
|-------|------------------------------|
| Arguments | None (uses authenticated user) |
| Logic | Purchase a specific scratch box |
| Output | Purchased scratch box details |

This function allows a user to purchase a specific scratch box. It should:
1. Verify that the scratch box is available for purchase.
2. Check if the user has sufficient funds.
3. Process the payment.
4. Transfer ownership of the scratch box to the user.
5. Return the details of the purchased scratch box.

### Open Scratch Box

| Route | POST /scratch-boxes/{id}/open |
|-------|--------------------------------|
| Arguments | None (uses authenticated user) |
| Logic | Open a specific scratch box owned by the user |
| Output | Contents of the opened scratch box |

This endpoint allows a user to open a scratch box they own. It should:
1. Verify that the user owns the specified scratch box.
2. Reveal the contents of the scratch box.
3. Transfer any lands or assets from the box to the user's account.
4. Mark the scratch box as opened.
5. Return the details of the contents received.

## Asset Listing Management

### Get Asset Listings

| Route | GET /asset-listings |
|-------|---------------------|
| Arguments | None |
| Logic | Retrieve all active asset listings |
| Output | List of active asset listings |

This function retrieves all active asset listings in the marketplace. It should return details of each listing, including the asset type, amount, price, and seller information.

### Create Asset Listing

| Route | POST /asset-listings |
|-------|----------------------|
| Arguments | asset_type, amount, price_in_bnb |
| Logic | Create a new asset listing |
| Output | Created listing details |

This endpoint allows a user to create a new asset listing. It should:
1. Verify that the user has sufficient assets to create the listing.
2. Lock the specified amount of assets.
3. Create a new listing record.
4. Return the details of the created listing.

### Update Asset Listing

| Route | PUT /asset-listings/{listing} |
|-------|------------------------------|
| Arguments | price_in_bnb |
| Logic | Update the price of an existing asset listing |
| Output | Updated listing details |

This function allows a user to update the price of their existing asset listing. It should:
1. Verify that the authenticated user is the owner of the listing.
2. Update the price of the listing.
3. Return the updated listing details.

### Delete Asset Listing

| Route | DELETE /asset-listings/{listing} |
|-------|----------------------------------|
| Arguments | None (uses authenticated user) |
| Logic | Remove an asset listing |
| Output | Success message |

This endpoint allows a user to remove their asset listing. It should:
1. Verify that the authenticated user is the owner of the listing.
2. Remove the listing.
3. Unlock the previously locked assets.
4. Return a success message.

### Buy Listed Asset

| Route | POST /asset-listings/{listing}/buy |
|-------|-------------------------------------|
| Arguments | None (uses authenticated user) |
| Logic | Purchase a listed asset |
| Output | Transaction details |

This function allows a user to purchase a listed asset. It should:
1. Verify that the buyer has sufficient funds.
2. Process the payment from buyer to seller.
3. Transfer the asset from seller to buyer.
4. Remove the listing.
5. Return the details of the completed transaction.
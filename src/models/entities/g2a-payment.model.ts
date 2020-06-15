// export interface G2APaymentModel {
//     api_hash: string;
//     hash: string;
//     order_id: string;
//     amount: string;
//     currency: string;
//     description?: string;
//     email?: string;
//     url_failure: string;
//     url_ok: string;
//     cart_type?: string;
//     items: G2APaymentItemModel[];
//     addresses?: G2APaymentAddressModel[];
//     process_payment?: string;
//     customer_ip_address: string;
//     security_steam_id?: string;
//     security_user_whitelisted?: string;
//     security_previously_verified?: string;
//     security_user_logged_in?: string;
//     security_new_client?: string;
//     security_registration_country?: string;
//     security_registration_date?: string;
//     security_first_transaction_date?: string;
//     security_phone_number?: string;
//     security_verified_email?: string;
//     security_google_id?: string;
//     security_facebook_id?: string;
//     security_twitter_id?: string;
//     security_vk_id?: string;
//     security_twitch_id?: string;
//     security_reddit_id?: string;
//     security_discord_id?: string;
//     security_rsgold_id?: string;
// }

// export interface G2APaymentItemModel {
//     sku: string;
//     name: string;
//     amount: number;
//     qty: number;
//     extra?: string;
//     type?: string;
//     id: string;
//     price: number;
//     url: string;
// }

// export interface G2APaymentAddressModel {
//     billing: G2APaymentBillingModel[];
//     shipping: G2APaymentShippingModel[];
// }

// export interface G2APaymentBillingModel {
//     firstname: string;
//     lastname: string;
//     line_1: string;
//     line_2?: string;
//     zip_code: string;
//     city: string;
//     company?: string;
//     county?: string;
//     country: string;
// }

// export interface G2APaymentShippingModel {
//     firstname: string;
//     lastname: string;
//     line_1: string;
//     line_2?: string;
//     zip_code: string;
//     city: string;
//     company?: string;
//     county?: string;
//     country: string;
// }

// export interface G2APaymentResponseModel {
//     status: string,
//     token: string;
// } 
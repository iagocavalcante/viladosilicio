<?php
/* Adicionar ao codigo do plugin do onesignal do wordpress, hoje inserido na pagina 
onesignal-free-web-push-notifications/onesignal.php

Push notify OneSignal Filter */

add_filter('onesignal_send_notification', 'onesignal_send_notification_filter', 10, 4);
function onesignal_send_notification_filter($fields, $new_status, $old_status, $post) {
/* Goal: We don't want to modify the original $fields array, because we want the
original web push notification to go out unmodified.
However, we want to send an additional notification to Android and iOS
devices with an additionalData property.
*/

/* Not entirely sure if this PHP function makes a deep copy of our $fields array;
it may not be necessary. */
$fields_dup = $fields;
$fields_dup['isAndroid'] = true;
$fields_dup['isIos'] = true;
$fields_dup['isAnyWeb'] = false;
$fields_dup['isWP'] = false;
$fields_dup['isAdm'] = false;
$fields_dup['isChrome'] = false;
/* $fields_dup['data'] = array("myappurl" => $fields['url']);*/
$fields_dup['data'] = array("postid" => $post->ID, "sharelink" => $fields['url']);
$url = wp_get_attachment_url( get_post_thumbnail_id($post->ID) );
$fields_dup['big_picture'] = $url;
//$fields_dup['buttons'] = '[{"id": "id1", "text": "Settings", "icon": "ic_menu_manage"}, {"id": "id2", "text": "Share", "icon": "ic_menu_share"}]';
$fields_dup['buttons'] = '[{"id": "id1", "text": "Compartilhar", "icon": "ic_menu_share"}]';
unset($fields_dup['url']);

/* Send another notification via cURL */
$ch = curl_init();
$onesignal_post_url = "https://onesignal.com/api/v1/notifications";
/* Hopefully OneSignal::get_onesignal_settings(); can be called outside of the plugin */
$onesignal_wp_settings = OneSignal::get_onesignal_settings();
$onesignal_auth_key = $onesignal_wp_settings['app_rest_api_key'];
curl_setopt($ch, CURLOPT_URL, $onesignal_post_url);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
'Content-Type: application/json',
'Authorization: Basic ' . $onesignal_auth_key
));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($fields_dup));
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
// Optional: Turn off host verification if SSL errors for local testing
// curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

/* Optional: cURL settings to help log cURL output response
curl_setopt($ch, CURLOPT_FAILONERROR, false);
curl_setopt($ch, CURLOPT_HTTP200ALIASES, array(400));
curl_setopt($ch, CURLOPT_VERBOSE, true);
curl_setopt($ch, CURLOPT_STDERR, $out);
*/
$response = curl_exec($ch);

/* Optional: Log cURL output response
fclose($out);
$debug_output = ob_get_clean();
$curl_effective_url = curl_getinfo($ch, CURLINFO_EFFECTIVE_URL);
$curl_http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curl_total_time = curl_getinfo($ch, CURLINFO_TOTAL_TIME);
onesignal_debug('OneSignal API POST Data:', $fields);
onesignal_debug('OneSignal API URL:', $curl_effective_url);
onesignal_debug('OneSignal API Response Status Code:', $curl_http_code);
if ($curl_http_code != 200) {
onesignal_debug('cURL Request Time:', $curl_total_time, 'seconds');
onesignal_debug('cURL Error Number:', curl_errno($ch));
onesignal_debug('cURL Error Description:', curl_error($ch));
onesignal_debug('cURL Response:', print_r($response, true));
onesignal_debug('cURL Verbose Log:', $debug_output);
}
*/
curl_close($ch);
return $fields;
}

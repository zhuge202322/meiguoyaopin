<?php
/**
 * @wordpress-plugin
 * Plugin Name:         Nexus Pay
 * Plugin URI:
 * Description:         Process credit cards in WooCommerce with Nexus Pay.
 * Version:             1.0.5
 * Author:              Xia Ren
 * Author URI:
 *
 *************
 * Attribution
 *************
 * Woo Payment Processing - Nexus Pay is a derivative work of the code from WooThemes / WebDevStudios,
 * which is licensed with GPLv3.  This code is also licensed under the terms
 * of the GNU Public License, version 3.
 */

// ABSPATH
if (!defined('ABSPATH')) {
    exit;
}

add_action('plugins_loaded', 'woocommerce_nexus_init', 0);

function woocommerce_nexus_init()
{
    if (!class_exists('WC_Payment_Gateway')) return;

    load_plugin_textdomain('wc_gateway_nexus', false, dirname(plugin_basename(__FILE__)) . '/languages');

    class WC_Gateway_Nexus extends WC_Payment_Gateway
    {
        public function __construct()
        {
            global $woocommerce;
            date_default_timezone_set('Asia/Shanghai');

            $this->id = 'nexus';
            $this->icon = plugins_url("/images/cards.png", __FILE__);
            $this->method_title = __('Nexus Pay', 'wc_gateway_nexus');
            $this->method_description = __('Secure payment via Credit Card using Nexus Pay.', 'wc_gateway_nexus');

            // Define user set variables
            $this->title = $this->get_option('nexus_title') ?: __('Nexus Pay', 'wc_gateway_nexus');
            $this->description = $this->get_option('nexus_description') ?: __('Secure payment via Credit Card using Nexus Pay.', 'wc_gateway_nexus');
            $this->merchant_code = $this->get_option('nexus_merchant_code');
            $this->api_secret = $this->get_option('nexus_api_secret');
            $this->product_code = $this->get_option('nexus_product_code');
            $this->gateway = $this->get_option('nexus_gateway', 'https://api.yourdomain.com');
            $this->debug = $this->get_option('nexus_debug') === 'yes';

            $this->has_fields = true;
            $this->supports = array('products', 'blocks', 'tokenization');

            // Load the settings.
            $this->init_form_fields();
            $this->init_settings();

            // Actions
            add_action('woocommerce_update_options_payment_gateways_' . $this->id, [$this, 'process_admin_options']);
            add_action('woocommerce_api_nexus_notify', [$this, 'pay_notify']);
        }

        public function logger($data)
        {
            if ($this->debug) {
                $logger_handle = new WC_Logger();
                $logger_handle->add("nexus_debug_info", is_array($data) ? json_encode($data) : $data);
            }
        }

        function admin_options()
        {
            ?>
            <h3><?php _e('Nexus Pay', 'wc_gateway_nexus'); ?></h3>
            <p><?php _e('This gateway allows you to accept payments via Credit Cards using Nexus Pay.', 'wc_gateway_nexus'); ?></p>
            <table class="form-table">
                <?php $this->generate_settings_html(); ?>
            </table>
            <?php
        }

        public function init_form_fields()
        {
            $this->form_fields = array(
                'enabled' => array(
                    'title' => __('Enable/Disable', 'wc_gateway_nexus'),
                    'type' => 'checkbox',
                    'label' => __('Enable Nexus Payment', 'wc_gateway_nexus'),
                    'default' => 'yes'
                ),
                'nexus_title' => array(
                    'title' => __('Title', 'wc_gateway_nexus'),
                    'type' => 'text',
                    'default' => __('Nexus Pay', 'wc_gateway_nexus'),
                ),
                'nexus_description' => array(
                    'title' => __('Description', 'wc_gateway_nexus'),
                    'type' => 'textarea',
                    'default' => __('Secure payment via Credit Card using Nexus Pay.', 'wc_gateway_nexus'),
                ),
                'nexus_merchant_code' => array(
                    'title' => __('Merchant Code (X-Merchant-Code)', 'wc_gateway_nexus'),
                    'type' => 'text',
                    'description' => __('Enter your Merchant Code assigned by the system.', 'wc_gateway_nexus'),
                ),
                'nexus_api_secret' => array(
                    'title' => __('API Secret', 'wc_gateway_nexus'),
                    'type' => 'password',
                    'description' => __('Enter your API Secret for signature generation.', 'wc_gateway_nexus'),
                ),
                'nexus_product_code' => array(
                    'title' => __('Product Code', 'wc_gateway_nexus'),
                    'type' => 'text',
                    'description' => __('Default product code for orders (e.g., CC_PAY).', 'wc_gateway_nexus'),
                ),
                'nexus_gateway' => array(
                    'title' => __('Gateway Root URL', 'wc_gateway_nexus'),
                    'type' => 'text',
                    'description' => __('The root URL of the payment system (e.g., https://api.saas.com).', 'wc_gateway_nexus'),
                ),
                'nexus_debug' => array(
                    'title' => __('Debug Log', 'wc_gateway_nexus'),
                    'label' => __('Enable logging', 'wc_gateway_nexus'),
                    'type' => 'checkbox',
                    'default' => 'no'
                ),
            );
        }

        function payment_fields()
        {
            ?>
            <style>
                .payment_method_nexus label img { width: 260px; }
                #nexus-cc-form { margin: 20px 0 !important; max-width: 100% !important; }
                #nexus-cc-form p.form-row { margin-bottom: 20px !important; float: none !important; width: 100% !important; clear: both !important; display: block !important; }
                #nexus-cc-form label { display: block !important; font-weight: 700 !important; margin-bottom: 10px !important; font-size: 14px !important; color: #1a202c !important; line-height: 1.2 !important; }
                #nexus-cc-form input.input-text, #nexus-cc-form select { width: 100% !important; height: 50px !important; padding: 0 15px !important; border: 1px solid #cbd5e0 !important; border-radius: 6px !important; background: #fff !important; font-size: 16px !important; box-sizing: border-box !important; outline: none !important; }
                #nexus-cc-form .nexus-expiry-row { display: flex !important; gap: 15px !important; align-items: flex-end !important; }
                #nexus-cc-form .nexus-expiry-row p { flex: 1 !important; margin: 0 !important; width: auto !important; }
                #nexus-cc-form .nexus-expiry-row .nexus-expiry-field { flex: 1 !important; }
                @media (max-width: 480px) { #nexus-cc-form .nexus-expiry-row { flex-direction: column !important; } }
                
                /* 同事添加的 UI 样式 */
                #nexus-cc-form .input-wrapper { position: relative; display: inline-block; width: 100%; }
                #nexus-cc-form .input-wrapper input { width: 100%; padding-right: 40px; box-sizing: border-box; }
                input[name="nexus_cc_number"] {
                    background: no-repeat; background-position: right center; background-size: 120px auto;
                    background-image: url(/wp-content/plugins/woo-gateway-nexus/images/vmj.png);
                }
                input[name="nexus_cc_cvv"] {
                    background: no-repeat; background-position: right center; background-size: 40px auto;
                    background-image: url(/wp-content/plugins/woo-gateway-nexus/images/cvv.gif);
                }
            </style>

            <fieldset id="nexus-cc-form" class="wc-credit-card-form wc-payment-form" style="display: block !important;">
                <p><img src="/wp-content/plugins/woo-gateway-nexus/images/card.png" style="width: 26px;margin: 0 5px 0 0;"><span>Secure Pay</span></p>
                <p><img src="/wp-content/plugins/woo-gateway-nexus/images/lock.png" style="width: 18px;margin:0 5px 0 0;"><span style="color: #68BC94;">Secured by Nexus</span></p>

                <p class="form-row form-row-wide">
                    <label><?php _e("Card Number", 'wc_gateway_nexus') ?> <span class="required">*</span></label>
                    <div class="input-wrapper">
                        <input type="text" name="nexus_cc_number" id="nexus_cc_number" placeholder="•••• •••• •••• ••••" maxlength="19" inputmode="numeric" />
                    </div>
                </p>
                <div class="nexus-expiry-row">
                    <p class="form-row nexus-expiry-field">
                        <label><?php _e("Expiration Date", 'wc_gateway_nexus') ?> <span class="required">*</span></label>
                        <input type="text" id="nexus_cc_expires_at" placeholder="MM/YY" inputmode="numeric" maxlength="5" autocomplete="cc-exp" />
                        <input type="hidden" name="nexus_cc_expires_month" id="nexus_cc_expires_month" />
                        <input type="hidden" name="nexus_cc_expires_year" id="nexus_cc_expires_year" />
                    </p>
                    <p class="form-row">
                        <label><?php _e("Card CVV", 'wc_gateway_nexus') ?> <span class="required">*</span></label>
                        <input type="password" name="nexus_cc_cvv" id="nexus_cc_cvv" placeholder="CVV" maxlength="4" style="width: 100%" />
                    </p>
                </div>
                <input type="hidden" name="Newcard_os" id="Newcard_os" />
                <input type="hidden" name="Newcard_device" id="Newcard_device" />
                <input type="hidden" name="Newcard_width" id="Newcard_width" />
                <input type="hidden" name="Newcard_height" id="Newcard_height" />
                <input type="hidden" name="Newcard_time_zone" id="Newcard_time_zone" />
            </fieldset>

            <script type="text/javascript">
                (function($) {
                    window.getOperatingSystem = function() {
                        var ua = navigator.userAgent;
                        if (/android/i.test(ua)) return "Android";
                        if (/iPad|iPhone|iPod/.test(ua)) return "iOS";
                        if (/Win/i.test(ua)) return "Windows";
                        if (/Mac/i.test(ua)) return "Mac OS";
                        return "Unknown";
                    };

                    window.detectDeviceType = function() {
                        var ua = navigator.userAgent;
                        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return "Pad";
                        if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile/.test(ua)) return "Mobile";
                        return "PC";
                    };

                    function broserInit() {
                        $('#Newcard_os').val(window.getOperatingSystem());
                        $('#Newcard_device').val(window.detectDeviceType());
                        $('#Newcard_width').val(window.screen.width);
                        $('#Newcard_height').val(window.screen.height);
                        $('#Newcard_time_zone').val(new Date().getTimezoneOffset() / 60 * (-1));
                    }

                    function formatCardNumber(val) {
                        var digits = val.replace(/\D/g, '').substring(0, 16);
                        return digits.match(/.{1,4}/g)?.join(' ') || digits;
                    }

                    function syncExpiryFields(rawValue) {
                        var digits = String(rawValue || '').replace(/\D/g, '').slice(0, 4);
                        if (digits.length === 1 && parseInt(digits) > 1) digits = '0' + digits;
                        var month = digits.slice(0, 2);
                        var year = digits.slice(2, 4);
                        if (month.length === 2) {
                            var m = parseInt(month);
                            if (m > 12) month = '12';
                            if (m === 0 && digits.length === 2) month = '01';
                        }
                        var displayValue = month + (digits.length > 2 ? '/' + year : '');
                        $('#nexus_cc_expires_at').val(displayValue);
                        $('#nexus_cc_expires_month').val(month);
                        $('#nexus_cc_expires_year').val(year ? ('20' + year) : '');
                    }

                    $(function() {
                        broserInit();
                        $(document.body).on('input', '#nexus_cc_number', function() { $(this).val(formatCardNumber($(this).val())); });
                        $(document.body).on('input', '#nexus_cc_expires_at', function() { syncExpiryFields($(this).val()); });
                        $(document.body).on('updated_checkout', function() {
                            syncExpiryFields($('#nexus_cc_expires_at').val());
                            $('#nexus_cc_number').val(formatCardNumber($('#nexus_cc_number').val()));
                            broserInit();
                        });
                        $(document.body).on('click', '#place_order', broserInit);
                    });
                })(jQuery);
            </script>
            <?php
        }

        function validate_fields()
        {
            $card_data = $this->get_block_checkout_data();
            if ($card_data) {
                $_POST['nexus_cc_number'] = $card_data['cardNo'];
                $_POST['nexus_cc_expires_month'] = $card_data['expires_month'];
                $_POST['nexus_cc_expires_year'] = $card_data['expires_year'];
                $_POST['nexus_cc_cvv'] = $card_data['cvv'];
            }

            $cardNo = str_replace(array(' ', '-'), '', trim($_POST['nexus_cc_number'] ?? ''));
            $cardYear = trim($_POST['nexus_cc_expires_year'] ?? '');
            $cardMonth = trim($_POST['nexus_cc_expires_month'] ?? '');
            $cardCVV = trim($_POST['nexus_cc_cvv'] ?? '');

            if (empty($cardNo) || empty($cardYear) || empty($cardMonth) || empty($cardCVV)) {
                wc_add_notice(__('Please ensure all credit card fields are filled.', 'wc_gateway_nexus'), 'error');
                return false;
            }

            $_SESSION["nexus"] = [
                "cardNo" => $cardNo, "expires_year" => $cardYear, "expires_month" => $cardMonth, "cvv" => $cardCVV,
                "Newcard_os" => $_POST['Newcard_os'] ?? '', "Newcard_device" => $_POST['Newcard_device'] ?? '',
                "Newcard_width" => $_POST['Newcard_width'] ?? '', "Newcard_height" => $_POST['Newcard_height'] ?? '',
                "Newcard_time_zone" => $_POST['Newcard_time_zone'] ?? ''
            ];
            return true;
        }

        public function process_payment($order_id)
        {
            $order = wc_get_order($order_id);
            $card_data = $_SESSION["nexus"] ?? $this->get_block_checkout_data();

            if (!$card_data || empty($card_data["cardNo"])) {
                wc_add_notice(__('Missing credit card information.', 'wc_gateway_nexus'), 'error');
                return array('result' => 'failure', 'redirect' => '');
            }

            $request_body = array(
                'orderNo'           => (string)$order->get_id() . wp_generate_password(4, false),
                'productCode'       => $this->product_code,
                'amount'            => (float)$order->get_total(),
                'currencyCode'      => strtoupper($order->get_currency()),
                'countryCode'       => $order->get_billing_country(),
                'settlementCurrency'=> strtoupper($order->get_currency()),
                'payType'           => 'CC', 
                'sourceChannel'     => 'Wordpress',
                'sourceSystem'      => 'WooCommerce',
                'sourceSite'        => $_SERVER['HTTP_HOST'],
                'sourceIp'          => $this->get_client_ip(),
                'customerFirstName' => $order->get_billing_first_name(),
                'customerLastName'  => $order->get_billing_last_name(),
                'customerPhone'     => $order->get_billing_phone(),
                'customerEmail'     => $order->get_billing_email(),
                'customerCountry'   => $order->get_billing_country(),
                'receiverFirstName' => $order->get_shipping_first_name() ?: $order->get_billing_first_name(),
                'receiverLastName'  => $order->get_shipping_last_name() ?: $order->get_billing_last_name(),
                'receiverPhone'     => $order->get_shipping_phone() ?: $order->get_billing_phone(),
                'receiverCountry'   => $order->get_shipping_country() ?: $order->get_billing_country(),
                'receiverState'     => $order->get_shipping_state() ?: $order->get_billing_state(),
                'receiverCity'      => $order->get_shipping_city() ?: $order->get_billing_city(),
                'receiverPostalCode'=> $order->get_shipping_postcode() ?: $order->get_billing_postcode(),
                'receiverAddress'   => trim($order->get_shipping_address_1() . ' ' . $order->get_shipping_address_2()) ?: trim($order->get_billing_address_1() . ' ' . $order->get_billing_address_2()),
                'billingFirstName'  => $order->get_billing_first_name(),
                'billingLastName'   => $order->get_billing_last_name(),
                'billingPhone'      => $order->get_billing_phone(),
                'billingEmail'      => $order->get_billing_email(),
                'billingCountry'    => $order->get_billing_country(),
                'billingState'      => $order->get_billing_state(),
                'billingCity'       => $order->get_billing_city(),
                'billingPostalCode' => $order->get_billing_postcode(),
                'billingAddress'    => $order->get_billing_address_1() . ' ' . $order->get_billing_address_2(),
                'cardNo'            => $card_data['cardNo'],
                'cardHolderFirstName' => $order->get_billing_first_name(),
                'cardHolderLastName'  => $order->get_billing_last_name(),
                'cardExpiryMonth'   => str_pad($card_data['expires_month'], 2, '0', STR_PAD_LEFT),
                'cardExpiryYear'    => $card_data['expires_year'],
                'cvv'               => $card_data['cvv'],
                'browserUserAgent'  => $_SERVER['HTTP_USER_AGENT'] ?? '',
                'browserLanguage'   => $_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? '',
                'browserResolution' => (isset($card_data['Newcard_width']) && isset($card_data['Newcard_height'])) ? ($card_data['Newcard_width'] . 'x' . $card_data['Newcard_height']) : '1920x1080',
                'browserTimezone'   => $card_data['Newcard_time_zone'] ?? '',
                'browserReferer'    => $_SERVER['HTTP_REFERER'] ?? '',
                'shopUrl'           => site_url(),
                'notifyUrl'         => WC()->api_request_url('nexus_notify'),
                'returnUrl'         => $this->get_return_url($order),
                'customerIp'        => $this->get_client_ip(),
                'remark'            => 'WooCommerce Order #' . $order->get_id()
            );

            $items = array();
            foreach ($order->get_items() as $item) {
                $product = $item->get_product();
                $items[] = array(
                    'sku' => $product->get_sku() ?: $product->get_id(),
                    'name' => $product->get_name(),
                    'price' => number_format($product->get_price(), 2, '.', ''),
                    'quantity' => $item->get_quantity(),
                    'total' => number_format($item->get_total(), 2, '.', ''),
                    'url' => $product->get_permalink()
                );
            }
            $request_body['itemsJson'] = json_encode($items);

            $json_body = json_encode($request_body);
            $path = '/openapi/trade/orders';
            $timestamp = round(microtime(true) * 1000);
            $nonce = wp_generate_password(16, false);
            $signature = $this->generate_v1_signature('POST', $path, '', $json_body, $timestamp, $nonce);

            $response = wp_remote_post(rtrim($this->gateway, '/') . $path, array(
                'method' => 'POST',
                'headers' => array(
                    'Content-Type' => 'application/json',
                    'X-Merchant-Code' => $this->merchant_code,
                    'X-Timestamp' => $timestamp,
                    'X-Nonce' => $nonce,
                    'X-Signature' => $signature,
                    'X-Sign-Version' => 'v1',
                ),
                'body' => $json_body,
                'timeout' => 30, 'sslverify' => false
            ));

            if (is_wp_error($response)) {
                wc_add_notice('Gateway Error: ' . $response->get_error_message(), 'error');
                return array('result' => 'failure', 'redirect' => '');
            }

            $result = json_decode(wp_remote_retrieve_body($response), true);
            if (isset($result['code']) && $result['code'] == 200) {
                $data = $result['data'];
                if (isset($data['status']) && (int)$data['status'] === 3) {
                    throw new Exception($data['errorMessage'] ?: __('Payment failed at gateway.', 'wc_gateway_nexus'));
                }
                $order->add_order_note('Nexus Pay Transaction Created: ' . ($data['transactionNo'] ?? ''));
                unset($_SESSION["nexus"]);
                return array('result' => 'success', 'redirect' => !empty($data['payUrl']) ? $data['payUrl'] : $this->get_return_url($order));
            } else {
                throw new Exception($result['msg'] ?: __('Payment Processing Failed', 'wc_gateway_nexus'));
            }
        }

        private function generate_v1_signature($method, $path, $query, $body, $timestamp, $nonce)
        {
            $body_hash = hash('sha256', $body);
            $canonical_string = implode("\n", [strtoupper($method), $path, $query, $body_hash, $timestamp, $nonce, $this->api_secret]);
            return hash_hmac('sha256', $canonical_string, $this->api_secret);
        }

        public function pay_notify()
        {
            $raw_body = file_get_contents("php://input");
            $signature = $_SERVER['HTTP_X_SIGNATURE'] ?? '';
            $timestamp = $_SERVER['HTTP_X_TIMESTAMP'] ?? '';
            $nonce = $_SERVER['HTTP_X_NONCE'] ?? '';

            if (empty($signature) || empty($timestamp)) {
                status_header(400); die('Missing headers');
            }

            $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
            $expected_sign = $this->generate_v1_signature('POST', $path, '', $raw_body, $timestamp, $nonce);

            if (strtolower(str_replace('HMAC ', '', $signature)) !== strtolower($expected_sign)) {
                $this->logger("Signature Mismatch. Path: $path");
                status_header(401); die('Invalid signature');
            }

            $result = json_decode($raw_body, true);
            $merchant_order_no = $result['merchantOrderNo'] ?? '';
            $order_id = substr($merchant_order_no, 0, -4);
            $order = wc_get_order($order_id);

            if ($order) {
                $status = (int)($result['status'] ?? 0);
                if ($status === 2) { $order->payment_complete($result['transactionNo'] ?? ''); echo "success"; }
                elseif ($status === 3) { $order->update_status('failed', 'Payment failed via Gateway.'); echo "success"; }
                else { echo "pending"; }
            }
            exit;
        }

        private function get_client_ip() {
            $ip = $_SERVER['HTTP_X_REAL_IP'] ?? $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'];
            return trim(explode(',', $ip)[0]);
        }

        private function get_block_checkout_data() {
            $json_data = json_decode(file_get_contents('php://input'), true);
            $data = $json_data['payment_data'] ?? $json_data['paymentMethodData'] ?? null;
            if (!$data) return null;
            return [
                'cardNo' => str_replace(' ', '', $data['nexus_cc_number'] ?? ''),
                'expires_month' => $data['nexus_cc_expires_month'] ?? '',
                'expires_year' => $data['nexus_cc_expires_year'] ?? '',
                'cvv' => $data['nexus_cc_cvv'] ?? '',
                'Newcard_os' => $data['Newcard_os'] ?? '', 'Newcard_device' => $data['Newcard_device'] ?? '',
                'Newcard_width' => $data['Newcard_width'] ?? '', 'Newcard_height' => $data['Newcard_height'] ?? '',
                'Newcard_time_zone' => $data['Newcard_time_zone'] ?? '',
            ];
        }
    }

    add_filter('woocommerce_payment_gateways', function($methods) {
        $methods[] = 'WC_Gateway_Nexus'; return $methods;
    });

    add_filter("plugin_action_links_" . plugin_basename(__FILE__), function($actions) {
        $custom = array('configure' => sprintf('<a href="%s">%s</a>', admin_url('admin.php?page=wc-settings&tab=checkout&section=nexus'), __('Configure', 'wc_gateway_nexus')));
        return array_merge($custom, $actions);
    });
}

add_action('woocommerce_blocks_loaded', function() {
    if (!class_exists('Automattic\WooCommerce\Blocks\Payments\Integrations\AbstractPaymentMethodType')) return;

    class WC_Nexus_Blocks_Support extends \Automattic\WooCommerce\Blocks\Payments\Integrations\AbstractPaymentMethodType {
        protected $name = 'nexus';
        public function initialize() { $this->settings = get_option('woocommerce_nexus_settings', []); }
        public function is_active() { return is_admin() || (!empty($this->settings['enabled']) && 'yes' === $this->settings['enabled']); }
        public function get_payment_method_script_handles() {
            $script_path = 'assets/nexus-block-checkout.js';
            $script_asset_path = plugin_dir_path(__FILE__) . 'assets/nexus-block-checkout.asset.php';
            $script_asset = file_exists($script_asset_path) ? require($script_asset_path) : array('dependencies' => array('wp-element', 'wp-i18n', 'wc-blocks-registry'), 'version' => '1.0.3');
            wp_register_script('wc-nexus-blocks', plugins_url($script_path, __FILE__), $script_asset['dependencies'], $script_asset['version'], true);
            return ['wc-nexus-blocks'];
        }
        public function get_payment_method_data() {
            return [
                'title' => $this->settings['nexus_title'] ?? __('Nexus Pay', 'wc_gateway_nexus'),
                'description' => $this->settings['nexus_description'] ?? '',
                'supports' => ['products'],
            ];
        }
    }
    add_action('woocommerce_blocks_payment_method_type_registration', function($payment_method_registry) {
        $payment_method_registry->register(new WC_Nexus_Blocks_Support());
    });
});

( function( window, wp ) {
    const { registerPaymentMethod } = window.wc.wcBlocksRegistry;
    const { __ } = wp.i18n;
    const { createElement, useState, useEffect, useCallback } = wp.element;

    const NexusContent = ( props ) => {
        const { eventRegistration, emitResponse } = props;
        const { onPaymentSetup } = eventRegistration;

        // 使用 React State 管理数据，确保 100% 准确抓取
        const [cardData, setCardData] = useState({
            ccNo: '',
            expMonth: '',
            expYear: '',
            cvv: ''
        });

        // 提交逻辑：适配最新版 WooCommerce Blocks 的 Object 协议
        const handleSubmit = useCallback( () => {
            const paymentMethodData = {
                nexus_cc_number: cardData.ccNo.replace(/\s/g, ''),
                nexus_cc_expires_month: cardData.expMonth,
                nexus_cc_expires_year: cardData.expYear,
                nexus_cc_cvv: cardData.cvv,
                Newcard_os: window.getOperatingSystem ? window.getOperatingSystem() : '',
                Newcard_device: window.detectDeviceType ? window.detectDeviceType() : '',
                Newcard_width: String(window.screen.width),
                Newcard_height: String(window.screen.height),
                Newcard_time_zone: String(new Date().getTimezoneOffset() / 60 * (-1))
            };

            return {
                type: emitResponse.responseTypes.SUCCESS,
                meta: {
                    paymentMethodData: paymentMethodData,
                },
            };
        }, [ cardData, emitResponse ] );

        useEffect( () => {
            // 注册结账监听
            if ( onPaymentSetup ) {
                const unsubscribe = onPaymentSetup( handleSubmit );
                return () => unsubscribe();
            }
        }, [ onPaymentSetup, handleSubmit ] );

        const inputStyle = { width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px', boxSizing: 'border-box' };

        return createElement( 'div', { className: 'nexus-block-checkout-form', style: { padding: '15px', background: '#f9f9f9', borderRadius: '8px' } },
            createElement( 'div', { style: { marginBottom: '15px' } },
                createElement( 'label', { style: { display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' } }, __( 'Card Number', 'wc_gateway_nexus' ) ),
                createElement( 'input', {
                    type: 'text',
                    id: 'nexus_cc_number',
                    name: 'nexus_cc_number',
                    value: cardData.ccNo,
                    placeholder: '•••• •••• •••• ••••',
                    style: inputStyle,
                    maxLength: 19,
                    onChange: ( e ) => {
                        let val = e.target.value.replace(/\D/g, '').substring(0, 16);
                        let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
                        setCardData({ ...cardData, ccNo: formatted });
                    }
                } )
            ),
            createElement( 'div', { style: { display: 'flex', gap: '15px', marginBottom: '15px' } },
                createElement( 'div', { style: { flex: '1' } },
                    createElement( 'label', { style: { display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' } }, __( 'Expiry Date', 'wc_gateway_nexus' ) ),
                    createElement( 'input', {
                        type: 'text',
                        id: 'nexus_cc_expires_at',
                        value: (cardData.expMonth && cardData.expYear) ? `${cardData.expMonth}/${cardData.expYear.slice(-2)}` : (cardData.expMonth || ''),
                        placeholder: 'MM/YY',
                        style: inputStyle,
                        maxLength: 5,
                        onChange: ( e ) => {
                            let val = e.target.value.replace(/\D/g, '').substring(0, 4);
                            if (val.length === 1 && parseInt(val) > 1) val = '0' + val;
                            let month = val.substring(0, 2);
                            if (month.length === 2) {
                                let m = parseInt(month);
                                if (m > 12) month = '12';
                                if (m === 0) month = '01';
                            }
                            let year = val.substring(2, 4);
                            setCardData({ 
                                ...cardData, 
                                expMonth: month, 
                                expYear: year ? '20' + year : '' 
                            });
                        }
                    } )
                ),
                createElement( 'div', { style: { flex: '1' } },
                    createElement( 'label', { style: { display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' } }, __( 'CVV', 'wc_gateway_nexus' ) ),
                    createElement( 'input', {
                        type: 'password',
                        id: 'nexus_cc_cvv',
                        name: 'nexus_cc_cvv',
                        value: cardData.cvv,
                        maxLength: 4,
                        placeholder: 'CVC',
                        style: inputStyle,
                        onChange: ( e ) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '') })
                    } )
                )
            )
        );
    };

    // 注册支付方式到 Blocks 注册表
    registerPaymentMethod( {
        name: 'nexus',
        label: __( 'Credit Card Payment', 'wc_gateway_nexus' ),
        content: createElement( NexusContent ),
        edit: createElement( NexusContent ),
        canMakePayment: () => true,
        ariaLabel: __( 'Nexus Payment Method', 'wc_gateway_nexus' ),
        supports: { features: [ 'products' ] },
    } );
} )( window, window.wp );
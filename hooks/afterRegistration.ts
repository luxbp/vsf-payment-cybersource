import { METHOD_CODE } from '../index'
import i18n from '@vue-storefront/i18n'
import { isServer } from '@vue-storefront/core/helpers'
import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'
import Vue from 'vue'

export function afterRegistration (appConfig, store) {
  let correctPaymentMethod = false

  const placeOrder = () => {
    if (correctPaymentMethod) {
      if (store.state['payment-cybersource'].token) {
        Vue.prototype.$bus.$emit('checkout-do-placeOrder', {})
      } else {
        store.dispatch('notification/spawnNotification', {
          type: 'error',
          message: i18n.t('Tokenization required. Return to Payment Information and try again.'),
          action1: { label: i18n.t('OK') }
        })
        Vue.prototype.$bus.$emit('checkout-activate-section', 'payment')
      }
    }
  }

  // Update the methods
  let paymentMethodConfig = {
    'title': 'Cybersource',
    'code': METHOD_CODE,
    'cost': 0,
    'costInclTax': 0,
    'default': false,
    'offline': false,
    'is_server_method': false
  }

  store.dispatch('checkout/addPaymentMethod', paymentMethodConfig)

  if (!isServer) {
    let jsUrl = 'https://flex.cybersource.com/cybersource/assets/microform/0.4.0/flex-microform.min.js'
    let docHead = document.getElementsByTagName('head')[0]
    let docScript = document.createElement('script')
    docScript.type = 'text/javascript'
    docScript.src = jsUrl
    docHead.appendChild(docScript)

    EventBus.$on('checkout-before-placeOrder', placeOrder)

    EventBus.$on('checkout-payment-method-changed', (paymentMethodCode) => {
      correctPaymentMethod = paymentMethodCode === METHOD_CODE;
    })
  }
}

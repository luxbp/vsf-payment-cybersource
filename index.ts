import config from 'config'
import { afterRegistration } from './hooks/afterRegistration'
import { module } from './store'
import { StorageManager } from '@vue-storefront/core/lib/storage-manager'
import { StorefrontModule } from '@vue-storefront/core/lib/modules';

export const KEY = 'payment-cybersource'
export const METHOD_CODE = config.cybersource.backend_method_code || KEY

export const CyberSourceModule: StorefrontModule = function ({ store, router, appConfig }) {
  StorageManager.init(KEY)
  afterRegistration(appConfig, store)
  store.registerModule(KEY, module)
}

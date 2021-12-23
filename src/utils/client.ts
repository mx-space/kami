import { createClient } from '@mx-space/api-client'
import { axiosAdaptor } from '@mx-space/api-client/lib/adaptors/axios'

const client = createClient(axiosAdaptor)('')

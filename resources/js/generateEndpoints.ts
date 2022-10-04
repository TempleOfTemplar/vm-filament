import { generateEndpoints } from '@rtk-query/codegen-openapi'
import {resolve} from "url";


const api = await generateEndpoints({
    apiFile: './store/emptyApi.ts',
    schemaFile: resolve(__dirname, 'swagger.json'),
    hooks: true,
})

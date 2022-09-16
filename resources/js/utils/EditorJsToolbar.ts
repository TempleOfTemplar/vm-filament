// tools.js
import Table from '@editorjs/table'
import Paragraph from '@editorjs/paragraph'
import List from '@editorjs/list'
import Warning from '@editorjs/warning'
import LinkTool from '@editorjs/link'
import Image from '@editorjs/image'
import Header from '@editorjs/header'
import Quote from '@editorjs/quote'
import Marker from '@editorjs/marker'
import CheckList from '@editorjs/checklist'
import Delimiter from '@editorjs/delimiter'
import SimpleImage from '@editorjs/simple-image'

export const EDITOR_JS_TOOLS = {
    // NOTE: Paragraph is default tool. Declare only when you want to change paragraph option.
    // paragraph: Paragraph,
    table: Table,
    list: List,
    warning: Warning,
    linkTool: LinkTool,
    image: Image,
    header: Header,
    quote: Quote,
    marker: Marker,
    checklist: CheckList,
    delimiter: Delimiter,
    simpleImage: SimpleImage,
}

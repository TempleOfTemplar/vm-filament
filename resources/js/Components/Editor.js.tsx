/* eslint-disable react-hooks/exhaustive-deps */
import {default as React, FC, useEffect, useRef} from 'react';
import EditorJS, {OutputData} from '@editorjs/editorjs';
import Header from '@editorjs/header';
import {EDITOR_JS_TOOLS} from "@/utils/EditorJsToolbar";

const DEFAULT_INITIAL_DATA = () => {
    return {
        "time": new Date().getTime(),
        "blocks": [
            {
                "type": "header",
                "data": {
                    "text": "This is my awesome editor!",
                    "level": 1
                }
            },
        ]
    }
}

const EDITTOR_HOLDER_ID = 'editorjs';

type EditorJsProps = {
    data: OutputData,
    onChange: (data: OutputData) => void
}

const EditorJS: FC<EditorJsProps> = ({data, onChange}) => {
    const ejInstance = useRef<any>();
    const [editorData, setEditorData] = React.useState<OutputData>(data);


    useEffect(()=>{
        console.log("DATA", ejInstance.current);
        if(ejInstance.current) {
            console.log("RENDER", data);
            ejInstance.current.render(data);
        }

    }, [data, ejInstance]);

    // This will run only once
    useEffect(() => {
        if (!ejInstance.current) {
            initEditor();
        }
        return () => {
            ejInstance.current.destroy();
            ejInstance.current = null;
        }
    }, []);

    const initEditor = () => {
        const editor = new EditorJS({
            holder: EDITTOR_HOLDER_ID,
            tools: EDITOR_JS_TOOLS,
            logLevel: "ERROR",
            data: editorData,
            onReady: () => {
                console.log("ONREADY");
                ejInstance.current = editor;
                editor.render(data);
            },
            onChange: async () => {
                let content = await editor.saver.save();
                // Put your logic here to save this data to your DB
                // setEditorData(content);
                onChange(content);
            },
            autofocus: true,
            tools: {
                header: Header,
            },
        });
    };

    return (
        <React.Fragment>
            <div id={EDITTOR_HOLDER_ID}/>
        </React.Fragment>
    );
}

export default EditorJS;

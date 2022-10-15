import React, {FC} from 'react';
import {Helmet} from 'react-helmet-async';

type SeoProps = {
    title: string,
    description: string,
    type: string,
    url?: string,
    image?: string
}

const Seo: FC<SeoProps> = ({title, description, type, url, image}) => {

    return (
        <Helmet>
            { /* Standard metadata tags */}
            <title>{title}</title>
            <meta name='description' content={description}/>
            { /* End standard metadata tags */}
            { /* Social media tags */}
            <meta property="og:site_name" content="Virtual Mistress"/>
            <meta property="og:locale" content="ru_RU"/>
            <meta property="og:type" content="website"/>
            <meta property="og:title" content={title}/>
            <meta property="og:description" content={description}/>
            {url ? <meta property="og:url" content={url}/> : null}
            {image ? <meta property="og:image" content={image}/> : null}
        </Helmet>
    )
}
;

export default Seo;

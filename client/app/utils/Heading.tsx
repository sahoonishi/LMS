import React,{FC} from "react";
interface Headprops{
    title:string;
    desc:string;
    keyword:string;
}
const Heading:FC<Headprops>=({title,desc,keyword})=>{
    return (
        <>
        <title>{title}</title>
        <meta name="viewport" content='width=device-width,initial-scale=1' />
        <meta name="desc" content={desc} />
        <meta name="keyword" content={keyword} />
        </>
    )
}

export default Heading;
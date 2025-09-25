import React, {FC} from "react";
import {Modal,Box} from "@mui/material";
import { boolean } from "zod";

interface CustomProps={
open:boolean;
setOpen:React.Dispatch<SetStateAction<boolean>>;
}
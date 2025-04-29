import mongoose , {Document,Schema,Model} from "mongoose";
import argon2 from "argon2";

const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


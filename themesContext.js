import React, { createContext, useState } from 'react';
import colors from './constants/colors.json';


export const themeContext = React.createContext(colors.Toxic);

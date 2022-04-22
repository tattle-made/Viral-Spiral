# Setup

```
npm install
npm run start
```

This script fetches data from a sheet and saves it in data.json. Then the data in data.json is transformed. This new transformed data corresponds to cards would be printed in each deck. 

Note : if data.json is present in the folder, the script skips downloading it from google drive. If you don't want any of these optimizations, delete data.json and pages.json before running the script. can be done with `npm run reset`

check pages.json for output

# References : 
Uses the library google-spreadsheet extensively. I found the official documentation very userful. https://theoephraim.github.io/node-google-spreadsheet/#/
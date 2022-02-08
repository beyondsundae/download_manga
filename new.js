var fs = require('fs');
const https = require('https')
const axios = require('axios');
var himalaya = require('himalaya')
const prompt = require('prompt');
var _ = require('lodash');

require('dotenv').config();

function onErr(err) {
  console.log(err);
  return 1;
}


function formatBytes(bytes) {
  bytes = _.isNil(bytes) ? 0 : bytes
  var marker = 1024; // Change to 1000 if required
  var decimal = 2; // Change as required
  var kiloBytes = marker; // One Kilobyte is 1024 bytes
  var megaBytes = marker * marker; // One MB is 1024 KB
  var gigaBytes = marker * marker * marker; // One GB is 1024 MB
  var teraBytes = marker * marker * marker * marker; // One TB is 1024 GB

  if(bytes < megaBytes) return(bytes / kiloBytes).toFixed(decimal) + " KB";
  // return MB if less than a GB
  else if(bytes < gigaBytes) return(bytes / megaBytes).toFixed(decimal) + " MB";
  // return GB if less than a TB
  else return(bytes / gigaBytes).toFixed(decimal) + " GB";
}

let headerLink = 'https://nhentai.net/g/'
let Manga_URL

prompt.get(['Link'], function (err, result) {
  if (err) { return onErr(err); }

  Manga_URL = headerLink + result.Link
  console.log('------------------------------------')
  console.log('Link: ' + Manga_URL);
  console.log('------------------------------------')

// console.log(process.env.pathToUpload);

// fs.appendFile('mynewfile1.txt', 'Hello content!', function (err) {
//   if (err) throw err;
//   console.log('Saved!');
// });
const url = process.env.URL_HEADER
const rootPath = process.argv[1].split( '\\' ).slice( 0, -1 ).join( '/' )

  if(process.argv[1]){
    console.log(rootPath)

  }

  const getData = async () => {
    const config = {
      method: "get",
      url: Manga_URL,
      headers: {
        "Content-Type": "application/json",
      }
    };

    const req = await axios(config);
    const data =  req.data

    let json = himalaya.parse(data);
    json = json[2].children[1].children[4].children[0].content
    json = json.replace('window._gallery = JSON.parse(', '')
    json = json.replace(');', '')
    json = JSON.parse(json)
    json = JSON.parse(json)

    return json
  }

  const timer = ms => new Promise(res => setTimeout(res, ms))

  const StartDownload = async ( media_id, title, num_pages ) => {
    try {
      const code_manga = '/' + Manga_URL.split( '/' )[4]
      console.log('------------------------------------')
      console.log('URL: ', Manga_URL); 
      console.log('------------------------------------')
      console.log('code_manga: ', code_manga); 

      let path2 = null
      const type = process.env.TYPE

      if (!fs.existsSync(rootPath.concat(code_manga))) { //check if empty
        fs.mkdirSync(rootPath.concat(code_manga));
        console.log('------------------------------------')
        console.log('created path:', rootPath.concat(code_manga) )
        console.log('------------------------------------')

        let titleFile = title.english.replace("|", "") + "_" + Manga_URL.split( '/' )[4]

        for(let i = 1; i<= num_pages; i++){
          // const type = url.substring(url.lastIndexOf(".") + 1);
          // console.log("downloadFile -> type", type);
          path2 = `${rootPath}${code_manga}/${titleFile}_${i}.${type}` // create file
          // console.log('path2', path2)

          const file = fs.createWriteStream(path2);

          const final_url = `${url}${media_id}/${i}.${type}` 

          let checksizefile = {
            method: "get",
            url: `${final_url}`, // ยิงไป gis 
            headers: {
              "Content-Type": "application/json",
              // "access_token": req.body.user.accessToken,
            },
            // data: body, // json ใบคำขอ   starter pack
          };

          sizeFile = await axios(checksizefile);
          sizeFile = sizeFile.headers['content-length']
          console.log('sizeFile', final_url, formatBytes(sizeFile))

          https
            .get(final_url, function (response) {
              response.pipe(file);
          
            })
            .on("error", (e) => {
              console.error('download error ❌ ❌ ❌', e);
        
            });
            
            // return path3;
            
            await timer(500)
          }

          console.log('------------------------------------')
          console.log('Done');
          console.log('------------------------------------')
         
      }else{
        console.log('------------------------------------')
        console.log('Already Download');
         console.log('------------------------------------')
      }
    
      } catch (error) {
        console.log('error: ', error.response.status, 'statusText: ', error.response.statusText)
        
      }
  }

  const StartProcess = async () => {
    try {  
        const jsonRes = await getData()
        // console.log('jsonRes', jsonRes)
        const { media_id, title, num_pages  } = jsonRes
        console.log('------------------------------------')
        console.log('title >>>>', title)
        console.log('media_id >>>>', media_id)
        console.log('num_pages >>>>', num_pages, 'pages')


        await StartDownload( media_id, title, num_pages )

    } catch (err) {
      // handle any rejected Promises here.
    }
  }


  if(Manga_URL){
    StartProcess()
    
  }else{
    console.log('No parameter');
  }
 

});


// echo "################################################################"
// echo "# nhentai One key downloader                                   #"
// echo "# Author: Jindai Kirin                                         #"
// echo "# Github: https://github.com/YKilin/nhentai-one-key-downloader #"
// echo "# Blog  : https://lolico.moe                                   #"
// echo "################################################################"

  const downloadFile = async (url, uuid_generated, asset_group_id, asset_type_id, document_id, temp_filename, zoneId) => {
    if (url.charAt(url.length - 1) === "/") {
      return;
    }
    // console.log("downloadFile -> npa_no", npa_no);
    // console.log("downloadFile -> url", url);
  
    console.log(`
      █░█ █▀█ █░░
      █▄█ █▀▄ █▄▄
      ${url}
    `);
  
    let mkdir = "";
    const currentTime = moment();
    const currentYear = currentTime.tz("Asia/Bangkok").format("YYYY");
  
  
    // █▀▄▀█ █▄▀ █▀▄ █ █▀█
    // █░▀░█ █░█ █▄▀ █ █▀▄
    // เรื่องของ 10001339
    const path = parseInt(currentYear) + "/" + zoneId + "/" + asset_type_id + "/" + asset_group_id + "/" + document_id + "/" ;
  
    // console.log('path.split("/")', path.split("/"), '0')
  
    _.map(path.split("/"), (name, i) => {
      // console.log('name 🌶 🌶 🌶', name, '1')
      
  
      if (path.split("/").indexOf(name) === 0) {
        // console.log('path.split("/").indexOf(name) === 0 🌶 🌶 🌶', path.split("/").indexOf(name) === 0, '2', name)
        mkdir = mkdir.concat(name).concat("/");
      }
  
      // console.log('mkdir 🌶 ', mkdir, '3')
  
  
      // if its no exist, then create upload folder 
      if(!fs.existsSync(process.env.pathToUpload)){
        fs.mkdirSync(process.env.pathToUpload)
      }
  
      // console.log('process.env.pathToUpload.concat(mkdir) 🌶 🌶 🌶', process.env.pathToUpload.concat(mkdir), '4')
  
  
      // create path folder
        if (!fs.existsSync(process.env.pathToUpload.concat(mkdir))) {
          // console.log('do condition 1');
          fs.mkdirSync(process.env.pathToUpload.concat(mkdir));
          if (path.split("/").indexOf(name) !== 0) {
            // console.log('path.split("/").indexOf(name) !== 0 🌶 🌶 🌶 no exist', path.split("/").indexOf(name) !== 0, '5', name)
  
            mkdir = mkdir.concat(name).concat("/");
            // console.log('mkdir 🌶 🌶 no exist', mkdir, '6')
  
          }
        } else {
          // console.log('do condition 2');
          if (path.split("/").indexOf(name) !== 0) {
            // console.log('path.split("/").indexOf(name) !== 0 🌶 🌶 🌶 exist', path.split("/").indexOf(name) !== 0, '7', name)
            mkdir = mkdir.concat(name).concat("/");
            // console.log('mkdir 🌶 🌶 exist', mkdir, '8')
          }
        }
      
      
    });
  
    let path2 = null;
  
    //process.env.pathToUpload + 
  
    const type = url.substring(url.lastIndexOf(".") + 1);
    console.log("downloadFile -> type", type);
  
  
    // █▀█ ▄▀█ ▀█▀ █░█   █▀▄ █▀█ █░█░█ █▄░█ █░░ █▀█ ▄▀█ █▀▄
    // █▀▀ █▀█ ░█░ █▀█   █▄▀ █▄█ ▀▄▀▄▀ █░▀█ █▄▄ █▄█ █▀█ █▄▀
    path2 = process.env.pathToUpload +  path + temp_filename + "." + type;
    console.log('path2', path2)
  
  
    // █▀█ ▄▀█ ▀█▀ █░█   ▀█▀ █▀█   ▀█▀ ▄▀█ █▄▄ █░░ █▀▀
    // █▀▀ █▀█ ░█░ █▀█   ░█░ █▄█   ░█░ █▀█ █▄█ █▄▄ ██▄
    path3 = path + temp_filename + "." + type;
  
    // ▄▀█ █▀▄ █▀▄   █▀▀ █ █░░ █▀▀
    // █▀█ █▄▀ █▄▀   █▀░ █ █▄▄ ██▄
    logger.info("addFile");
    const file = fs.createWriteStream(path2);
  
    https
      .get(url, function (response) {
        response.pipe(file);
    
      })
      .on("error", (e) => {
        console.error('download error ❌ ❌ ❌', e);
  
      });
      
      return path3;
  };
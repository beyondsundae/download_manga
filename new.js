var fs = require('fs');
const https = require('https')
const axios = require('axios');
var himalaya = require('himalaya')
const util = require('util')

require('dotenv').config();

// console.log(process.env.pathToUpload);

// fs.appendFile('mynewfile1.txt', 'Hello content!', function (err) {
//   if (err) throw err;
//   console.log('Saved!');
// });
const url = "https://i.nhentai.net/galleries/"
const rootPath = process.argv[1].split( '\\' ).slice( 0, -1 ).join( '/' )

  if(process.argv[1]){
    console.log(rootPath)

  }



  const getData = async () => {
    const config = {
      method: "get",
      url: process.argv[2],
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
      const code_manga = '/' + process.argv[2].split( '/' )[4]
      console.log('------------------------------------')
      console.log('URL: ', process.argv[2]); 
      console.log('------------------------------------')
      console.log('code_manga: ', code_manga); 

      let path2 = null
      const type = 'jpg'

      if (!fs.existsSync(rootPath.concat(code_manga))) { //check if empty
        fs.mkdirSync(rootPath.concat(code_manga));
        console.log('------------------------------------')
        console.log('created path:', rootPath.concat(code_manga) )
        console.log('------------------------------------')

        let titleFile = title.english + "_" + process.argv[2].split( '/' )[4]

        for(let i = 1; i<= num_pages; i++){
          // const type = url.substring(url.lastIndexOf(".") + 1);
          // console.log("downloadFile -> type", type);
          path2 = `${rootPath}${code_manga}/${titleFile}_${i}.${type}` // create file
          // console.log('path2', path2)

          const file = fs.createWriteStream(path2);

          const final_url = `${url}${media_id}/${i}.${type}` 

          // let checksizefile = {
          //   method: "get",
          //   url: `${final_url}`, // ยิงไป gis 
          //   headers: {
          //     "Content-Type": "application/json",
          //     // "access_token": req.body.user.accessToken,
          //   },
          //   // data: body, // json ใบคำขอ   starter pack
          // };

          // sizeFile = await axios(checksizefile);
          // sizeFile = sizeFile.headers['content-length']
          console.log('sizeFile', final_url)

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

         
      }else{
        console.log('-------------- Already downloaded ---------------')
      }
    
      } catch (error) {
        
      }
  }

  const StartProcess = async () => {
    try {  
        const jsonRes = await getData()
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


  if(process.argv[2]){
    StartProcess()
    
  }else{
    console.log('No parameter');
  }
 

  

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
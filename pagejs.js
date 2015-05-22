document.addEventListener("DOMContentLoaded", function(event) {
    /*
        Handle <a href="" > tag
        Change all href to the server:port/url/
        So that when user click the link, it would still under the proxy
    */
    console.log("Change All href to go to this forward");
    var hrefs = document.getElementsByTagName("a");
    console.log("Total href = "+hrefs.length);
    for(var i=0;i<hrefs.length;i++)
    {
        
        try{
            var href = hrefs[i].href;
            //如果是絕對路徑   http開頭
            if(href.indexOf("http")!=-1)
            {
                //如果是自動由domain生成的，要處理
                if(href.indexOf(document.location.host)!=-1)
                {
                    console.log("Handle ABS path, but domain error => "+href);
                    console.log(webProxy_referer);
                    tmp = href.split(document.location.host+"/")[1];
                    console.log("we need =>"+tmp);
                    url = webProxy_referer+'/'+tmp;
                    console.log("Generate original url = "+url);
                    url = encodeURIComponent(url).replace(/'/g,"%27").replace(/"/g,"%22");
                    hrefs[i].setAttribute('href',"http://"+document.location.host+"/url/"+url);
                    
                }
                else
                {
                    console.log("Handle ABS path=> "+href);
                    url = encodeURIComponent(href).replace(/'/g,"%27").replace(/"/g,"%22");
                    hrefs[i].setAttribute('href',"http://"+document.location.host+"/url/"+url);
                }
            }
            //如果是相對路徑
            else
            {
                console.log("Unhandling Relative path "+href);
            }

            
        }catch(e){

        }    
    }//for
});
var setupButtons = (function ($) {

    function setCookie(c_name,value,rememberDay)
    {
        if(DEBUG) console.log('setCookie :' + value + ' on ' + c_name);
        var expired_date=new Date();
        expired_date.setDate(expired_date.getDate() + rememberDay);
        var c_value=escape(value) + ((rememberDay==null) ? "" : "; expires="+expired_date.toUTCString());
        document.cookie=c_name + "=" + c_value;
    }

    function getCookie(c_name)
    {
        var i,x,y,array_cookies=document.cookie.split(";");
        for (i=0;i<array_cookies.length;i++)
        {
            x=array_cookies[i].substr(0,array_cookies[i].indexOf("="));
            y=array_cookies[i].substr(array_cookies[i].indexOf("=")+1);
            x=x.replace(/^\s+|\s+$/g,"");
            if (x==c_name)
            {
                return unescape(y);
            }
        }
    }

    /*
    Function toggleFavourite
    handle onclick event on the favourite button
     */
    function toggleFavourite(el){
        if(el.firstChild.getAttribute('class') == notFavouriteState){
            el.firstChild.className = favouriteState;
            addFav(el.nextSibling.getAttribute('src'));
        } else {
            el.firstChild.className = notFavouriteState;
            removeFav(el.nextSibling.getAttribute('src'))
        }
    }

    /*
    Function checkState
    check the value whether it's a favorite or not
     */
    function checkState(value){
        if(typeof myFavs !== 'string') return false;

        if(DEBUG) console.log('searching :' + value + ' on ' + myFavs);

        if (myFavs.search(value) >= 0)
            return true;
        else
            return false;
    }

    /*
    Function addFav
    add the photo src into favourite list and set cookie
     */
    function addFav(value){
        if(DEBUG) console.log('adding Fav:' + value);
        if(typeof myFavs === 'string' && myFavs.length > 0){
            myFavs += '|' + value;
        } else
            myFavs = value;
        setCookie(cookieName, myFavs, rememberDays);
    }

    /*
    Function removeFav
    remove photo src from favourite list and set cookie
     */
    function removeFav(value){
        var i, array_fav = myFavs.split('|');

        if(DEBUG) console.log('removing Fav:' + value);

        myFavs = '';
        for(i=0; i<array_fav.length; i++){
            if(array_fav[i] != value) {
                myFavs += (myFavs.length > 0 ? '|':'') + array_fav[i];
            }
        }
        setCookie(cookieName, myFavs, rememberDays);
    }

    //--------- GLOBAL VAR ---------------

    var DEBUG = false;

    var rememberDays = 1; //COOKIE LIFE
    var cookieName = 'myFavouritePhotos';
    var myFavs; //Favourites photos holder

    var favouriteState = 'icon-heart';
    var notFavouriteState = 'icon-heart-empty';

    //----------- MAIN FUNCTION --------------

    return function(){
        //SET INITIAL FAVOURITE LIST FROM COOKIE
        myFavs = getCookie(cookieName);
        //GET ALL PHOTOS TO ADD FAVOURITE BUTTON
        var photoDiv = document.getElementById('photos').getElementsByClassName('photo');
        if(DEBUG) console.log('number of photo: ' + photoDiv.length);
        //CREATE BUTTON FOR EACH PHOTO
        for(i=0; i<photoDiv.length; i++){

            var btn = document.createElement('a');
            btn.className = 'fav-btn';
            btn.onclick  = function () { toggleFavourite(this) };

            var icon = document.createElement('i');
            //IF CHECKSTATE RETURN TRUE THEN SET BUTTON AS FAVOURITE
            if(checkState(photoDiv[i].firstChild.getAttribute('src')))
                icon.className = favouriteState;
            else
                icon.className = notFavouriteState;

            btn.appendChild(icon);
            photoDiv[i].insertBefore(btn, photoDiv[i].firstChild);
        }
    }

}(jQuery));
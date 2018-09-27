

//カンマを付けよう
function ChMoney(str) {
    var remoney = "";
    var money1 = new String(str);
    var money2= "";
    var cut = money1.length;
    var mp = money1.substr(0,1);
    if(mp == '-') {
        money1 = money1.substr(1,cut);
        cut = cut - 1;
    }
    for(var i = 0; i < cut; i +=3) {
        if(i == 0) {
            money2=money1.substr(cut-3,3);
        } else if(cut-i-3 >= 0) {
            money2=money1.substr(cut-3-i,3) + "," + money2;
        } else {
            money2=money1.substr(0,cut-i) + "," + money2;
        }
    }
    if(mp == '-') {
        remoney = mp + money2;
    } else {
        remoney = money2;
    }
    return remoney;
}

//率計算・第二位四捨五入
function Ritsu(par1,par2) {
    var writsu = "";
    var wlen = 0;
    writsu = Math.round(par1/par2*1000);
    writsu = writsu / 10;
    wlen = writsu.toString().indexOf(".",0);
    if(wlen == -1) {
        writsu = writsu+".0";
    }
    return writsu;
}


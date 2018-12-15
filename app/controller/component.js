
var initConf={
    index: {
        temType: 'B',
        main: {
            color: '',
            com: 'weiboHotList'
        },
        dec: {
            color: '',
            com: 'todoList'
        },
        bg: ''
    },
    article: {
        temType: 'A',
        main: {
            color: '',
            com: 'about'
        },
        bg: ''
    },
    pub: {
        nav: {
            color: '',
            com: 'nav'
        }
    }
}

var conf={
    index: {
        temType: 'B',
        main: {
            color: '',
            com: 'weiboHotList'
        },
        dec: {
            color: '',
            com: 'todoList'
        },
        bg: ''
    },
    article: {
        temType: 'A',
        main: {
            color: '',
            com: 'about'
        },
        bg: ''
    },
    pub: {
        nav: {
            color: '',
            com: 'nav'
        }
    }
}

exports.put_conf = function (req, res) {
    conf = initConf
    res.end(JSON.stringify(initConf))
}

exports.get_conf = function (req, res) {
    res.end(JSON.stringify(conf))
}

exports.post_conf = function (req, res) {
    conf = req.bodyData;
    res.end(JSON.stringify(conf))
}
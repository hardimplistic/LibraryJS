
// 链条工具类
function Chain(){
    var self = this;
    self.index = 0;
    self.chain = [];
    self.reset = function(){
        self.index = 0;
    };
    self.clear = function(){
        self.chain = [];
        self.index = 0;
    };
    self.method = function(fn){
        self.chain.push(fn);
    };
    self.start = function(){
        if(self.chain.length == 0){
            return;
        }
        var next = function(data){
            var fn = self.chain[++self.index];
            if(fn){
                fn(next, data);
            }
        };
        self.chain[0](next);
    };
    return self;
}
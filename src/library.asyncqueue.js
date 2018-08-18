
// 并行工具类
function AsyncQueue() {
    var self = this;
    self.queue = [];
    self.countdown = 0;
    self._finish = function() {};
    self.reset = function(){
        self.countdown = 0;
    };
    self.action = function(fn){
        self.queue.push(fn);
    };
    self.finish = function(fn){
        self._finish = fn;
    };
    self.start = function(){
        if(self.queue.length == 0){
            return;
        }
        var finish = function(){
            if (++ self.countdown == self.queue.length) {
                self._finish();
            }
        };
        for (var i in self.queue) {
            self.queue[i](finish);
        }
    };
}

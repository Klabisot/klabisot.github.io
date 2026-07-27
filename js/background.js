;(function(){
    var config = {
        circle: { amount: 20, color: [179, 100, 80], alpha: 0.45 },
        line: { amount: 14, color: [180, 175, 238], alpha: 0.4 }
    };

    function rand(min, max) {
        return min + Math.random() * (max - min);
    }

    function createParticles() {
        var container = document.getElementById('particles');
        if (!container) return;

        for (var i = 0; i < config.circle.amount; i++) {
            var el = document.createElement('div');
            var size = rand(40, 120);
            var driftDur = rand(45, 80);
            var driftDelay = -rand(0, 80);
            var flickerDur = rand(12, 20);
            var flickerDelay = rand(0, 5);
            el.className = 'particle circle';
            el.style.cssText = 'left:' + rand(0, 100) + '%;top:' + rand(0, 100) + '%;width:' + size + 'px;height:' + size + 'px;animation-name:drift,flicker;animation-duration:' + driftDur + 's,' + flickerDur + 's;animation-delay:' + driftDelay + 's,' + flickerDelay + 's;animation-timing-function:linear,ease-in-out;animation-iteration-count:infinite,infinite';
            container.appendChild(el);
        }

        for (var i = 0; i < config.line.amount; i++) {
            var el = document.createElement('div');
            var len = rand(20, 60);
            var driftDur = rand(45, 80);
            var driftDelay = -rand(0, 80);
            var flickerDur = rand(12, 20);
            var flickerDelay = rand(0, 5);
            el.className = 'particle line';
            el.style.cssText = 'left:' + rand(0, 100) + '%;top:' + rand(0, 100) + '%;width:' + len + 'px;animation-name:line-drift,flicker;animation-duration:' + driftDur + 's,' + flickerDur + 's;animation-delay:' + driftDelay + 's,' + flickerDelay + 's;animation-timing-function:linear,ease-in-out;animation-iteration-count:infinite,infinite';
            container.appendChild(el);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createParticles);
    } else {
        createParticles();
    }
})();

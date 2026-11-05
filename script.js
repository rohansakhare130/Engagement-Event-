(function(){
  var $=function(i){return document.getElementById(i)};
  var gate=$('gate'),env=$('env');
  document.body.style.overflow='hidden';
  $('seal').addEventListener('click',function(){
    gate.classList.add('open');env.classList.add('open');
    $('music').classList.add('show');startMusic();
    setTimeout(function(){
      gate.classList.add('done');document.body.style.overflow='';window.scrollTo(0,0);
      setTimeout(function(){gate.style.display='none'},900);
    },2600);
  });

  // Soft original melody made in the browser (C - Am - F - G loop)
  var ac,master,timer,nextT=0,bar=0,on=false;
  var chords=[[261.63,329.63,392],[220,261.63,329.63],[174.61,220,261.63],[196,246.94,293.66]];
  var BAR=4.8;
  function note(f,t,dur,vol,type){
    var o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.value=f;
    g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(vol,t+.06);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    o.connect(g);g.connect(master);o.start(t);o.stop(t+dur+.1);
  }
  function playBar(t){
    var c=chords[bar%4],seq=[0,1,2,1,2,1,0,1];
    c.forEach(function(f){note(f/2,t,BAR+.6,.07,'sine')});
    seq.forEach(function(k,i){note(c[k]*2,t+i*.6,1.4,.05,'triangle')});
    bar++;
  }
  function sched(){while(nextT<ac.currentTime+1.2){playBar(nextT);nextT+=BAR}}
  function setUI(){var b=$('music');b.setAttribute('aria-pressed',on);b.setAttribute('aria-label',on?'Turn music off':'Turn music on')}
  function startMusic(){
    try{
      if(!ac){var AC=window.AudioContext||window.webkitAudioContext;if(!AC){return}ac=new AC();master=ac.createGain();master.gain.value=0;master.connect(ac.destination)}
      ac.resume();nextT=ac.currentTime+.1;sched();clearInterval(timer);timer=setInterval(sched,500);
      master.gain.cancelScheduledValues(ac.currentTime);master.gain.linearRampToValueAtTime(.9,ac.currentTime+1.5);
      on=true;setUI();
    }catch(e){on=false;setUI()}
  }
  function stopMusic(){
    try{master.gain.cancelScheduledValues(ac.currentTime);master.gain.linearRampToValueAtTime(0,ac.currentTime+.5);
    clearInterval(timer);setTimeout(function(){if(!on)ac.suspend()},700)}catch(e){}
    on=false;setUI();
  }
  $('music').addEventListener('click',function(){on?stopMusic():startMusic()});
  setUI();

  var target=new Date(2026, 10, 12, 12, 0, 0).getTime();
  function pad(n){return String(n).padStart(2,'0')}
  function tick(){
    var sec=Math.floor(Math.max(0,target-Date.now())/1000);
    $('d').textContent=pad(Math.floor(sec/86400));
    $('h').textContent=pad(Math.floor(sec%86400/3600));
    $('m').textContent=pad(Math.floor(sec%3600/60));
    $('s').textContent=pad(sec%60);
  }
  tick();setInterval(tick,1000);

  var n=1;
  $('plus').onclick=function(){n=Math.min(8,n+1);$('gc').textContent=n};
  $('minus').onclick=function(){n=Math.max(1,n-1);$('gc').textContent=n};
  document.querySelectorAll('input[name=att]').forEach(function(r){
    r.addEventListener('change',function(){$('gb').style.display=document.querySelector('input[name=att]:checked').value==='no'?'none':''});
  });
  $('form').addEventListener('submit',function(e){
    e.preventDefault();
    var nm=$('name').value.trim();
    if(!nm){$('err').textContent='Please enter your name so we know who is replying.';$('name').focus();return}
    $('err').textContent='';
    var yes=document.querySelector('input[name=att]:checked').value==='yes';
    $('tt').textContent=yes?'See you there, '+nm+'.':'We will miss you, '+nm+'.';
    $('tp').textContent=yes?'We have saved '+n+(n>1?' seats':' seat')+' for you. Add the date to your calendar above.':'Thank you for letting us know. You will be in our thoughts that evening.';
    this.style.display='none';$('thanks').style.display='block';
  });
})();

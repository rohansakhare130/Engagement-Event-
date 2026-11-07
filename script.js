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
    var audio = new Audio('./Assets/song2.mp3');
  audio.loop = true;
  audio.volume = 0.6;
  var on = false;
 
  function setUI() {
    var b = $('music');
    b.setAttribute('aria-pressed', on);
    b.setAttribute('aria-label', on ? 'Turn music off' : 'Turn music on');
  }
  function startMusic() {
    audio.play().then(function () { on = true; setUI(); })
                .catch(function () { on = false; setUI(); });
  }
  function stopMusic() {
    audio.pause();
    on = false;
    setUI();
  }
 
  $('music').addEventListener('click', function () { on ? stopMusic() : startMusic(); });
  setUI();

  // Countdown (12 Nov 2026, 12:00 PM)
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

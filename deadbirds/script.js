var gl_initialCRO = 0;
var gl_AP = 0;
var gl_validcom = 0;
var gl_netFee = 0;

const hoursInYear = 8760;

function gain_doing_nothing(){

  var gain =  gl_initialCRO * gl_AP / 100;
  var validatorGain = gain*gl_validcom/100;

  gain = gain - validatorGain - gl_netFee;
  //gain += gl_initialCRO

  document.getElementById("doing_nothing").innerHTML = "By doing only one annual clain you will gain <imp>"+ gain.toFixed(2) +"</imp> CRO, your validator will earn "+validatorGain.toFixed(2)+" CRO"
}

function gain_restack_every_hours(hours){

  var number_of_restaks = hoursInYear / hours;
  var gain = 1 + ((gl_AP *hours) / (100 * hoursInYear));
  gain = gain ** number_of_restaks;
  gain = (gain * gl_initialCRO) - gl_initialCRO;
  var validatorGain = gain  *gl_validcom/100;
  gain = gain - validatorGain - (gl_netFee * number_of_restaks);
  return {gain,validatorGain};
}

function optimum_restack_hours_seeker(){
  var hours = 2;
  var lastgain = gain_restack_every_hours(1);
  for(;hours <= hoursInYear;hours++)
  {
    var {gain,validatorGain} = gain_restack_every_hours(hours);
    if( lastgain >= gain)
    {
      hours--;
      break;
    }
    lastgain = gain;
  }
  document.getElementById("doing_periodical").innerHTML = "By restaking every <imp>"+ hours +"</imp> H, you will gain <imp>"+lastgain.toFixed(2)+" </imp>CRO, and your validator will earn "+validatorGain.toFixed(2)+" CRO."
}

function gain_restack_every_earn(earnTrig){

  var oneHourPcent = (gl_AP / (hoursInYear * 100));
  var totalGain = 0;
  var validatorPart = 1 - (gl_validcom /100);

  for(let hour = 0; hour <hoursInYear;)
  {
    let oneHourGain = (gl_initialCRO + totalGain) * oneHourPcent;
    let hoursForTrig = earnTrig / oneHourGain;  
    hour += hoursForTrig;
    if ( hour <= hoursInYear )
    {
      totalGain += (oneHourGain * hoursForTrig * validatorPart) - gl_netFee;
    }
    else //l’heure dépasse un peu 
    {
      let remainStack = oneHourGain * (hoursForTrig - (hour - hoursInYear)) * validatorPart;
      if(remainStack > gl_netFee)
      {
        totalGain += remainStack - gl_netFee;
      }
    }
  }
  return totalGain;
}

function optimum_restack_earn_seeker(){
  var earnTrig = 0.1;
  var lastgain = gain_restack_every_earn(0.01);
  for(;earnTrig <= 1;earnTrig+=0.01)
  {
   
    var gain = gain_restack_every_earn(earnTrig);
    
    //console.log("( "+ earnTrig.toFixed(2) +" )  : "+ gain.toFixed(2));
    if( lastgain >= gain)
    {
      earnTrig-=0.01
      break;
    }
    lastgain = gain;
    
  }

    document.getElementById("doing_triggerCRO").innerHTML = "By restaking every <imp>"+ earnTrig.toFixed(2) +"</imp> CRO, you will earn <imp>"+ lastgain.toFixed(2) +"</imp> CRO"
  
}

const events = document.getElementsByName("toCompute");

for(var i = 0; i < events.length ; i++)
{
  events[i].addEventListener('change', toDo);
}

function toDo(){

    //Parsefloat to be sure having a number
    gl_initialCRO = parseFloat(document.getElementById("initialCRO").value);
    gl_AP = parseFloat(document.getElementById("AP").value);
    gl_validcom = parseFloat(document.getElementById("validcom").value);
    gl_netFee = parseFloat(document.getElementById("netFee").value);

    gain_doing_nothing();
    optimum_restack_hours_seeker();
    optimum_restack_earn_seeker();

}
toDo(); //Compute one first time

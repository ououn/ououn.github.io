function open_random(){
			
  var entryList = [
    "vocaloid_01",
    "vocaloid_02",
    "vocaloid_03",
    "jojo_03",
     "raid_01",
     "raid_02",
     "raid_03",
     "raid_04",
     "raid_05",
     "skin_01"
  ];
  
  var entryPicked = entryList[Math.floor(Math.random()*entryList.length)];

  document.getElementById("random_change").setAttribute("data-fresco-group", entryPicked);

  //alert(here);
  //alert(there);

}
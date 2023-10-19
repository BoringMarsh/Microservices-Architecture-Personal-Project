const tokens = {
    gaodeSecurityKey: "25984b5b420de887d1637bd818923645",
    gaodeDeveloperKey: "615995095ba6e5843fd777a9c055faba",
    cityWeatherToken: "947becc492f4475b8848308201de085f",
    cityAirToken: "f04af887d02240f7835527e2bacf76b5",
    citySearchToken: "mmad3vsph2i8acxktnqq83neft1blejp",
    cityGEOToken: "2eb4b89e57msh7d25aa73e2f1fddp1a1d57jsnc818e6cd3b16",
    cityCountryToken: "2eb4b89e57msh7d25aa73e2f1fddp1a1d57jsnc818e6cd3b16",
    cityAirportToken: "2eb4b89e57msh7d25aa73e2f1fddp1a1d57jsnc818e6cd3b16"
};

for (let key in tokens) {
    localStorage.setItem(key, tokens[key]);
}
describe("Process", function() {
  var process, process_list;
  var i, arrival, burst, color;

  beforeEach(function() {
    process_list = new ProcessList();
    process = new Process(1, 5, 10, process_list.colors[0]);
  });

  it("should set process id", function() {
    expect(process.id === 1)
  });

  // describe("when song has been paused", function() {
  //   beforeEach(function() {
  //     player.play(song);
  //     player.pause();
  //   });
  // 
  //   it("should indicate that the song is currently paused", function() {
  //     expect(player.isPlaying).toBeFalsy();
  // 
  //     // demonstrates use of 'not' with a custom matcher
  //     expect(player).not.toBePlaying(song);
  //   });
  // 
  //   it("should be possible to resume", function() {
  //     player.resume();
  //     expect(player.isPlaying).toBeTruthy();
  //     expect(player.currentlyPlayingSong).toEqual(song);
  //   });
  // });
  // 
  // // demonstrates use of spies to intercept and test method calls
  // it("tells the current song if the user has made it a favorite", function() {
  //   spyOn(song, 'persistFavoriteStatus');
  // 
  //   player.play(song);
  //   player.makeFavorite();
  // 
  //   expect(song.persistFavoriteStatus).toHaveBeenCalledWith(true);
  // });
  // 
  // //demonstrates use of expected exceptions
  // describe("#resume", function() {
  //   it("should throw an exception if song is already playing", function() {
  //     player.play(song);
  // 
  //     expect(function() {
  //       player.resume();
  //     }).toThrow("song is already playing");
  //   });
  // });
});
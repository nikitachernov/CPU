describe("Process", function() {
  var process, process_list;
  var i, arrival, burst, color;

  beforeEach(function() {
    process_list = new ProcessList();
  });

  describe("new", function() {
    describe("valid", function() {
      beforeEach(function(){
        i = 1;
        arrival = 5;
        burst = 10;
        color = process_list.colors[0];
        process = new Process(i, arrival, burst, color);
      });

      it("should create process", function() {
        expect(process).toBeCreated();
      });

      it("should set process id", function() {
        expect(process.id === i);
      });

      it("should set arrival time", function() {
        expect(process.arrival === arrival);
      });

      it("should set burst time", function() {
        expect(process.burst === burst);
      });

      it("should set process color", function() {
        expect(process.burst === burst);
      });
    });

    describe("invalid", function() {
      beforeEach(function(){
        i = 1;
        arrival = 5;
        burst = 10;
        color = process_list.colors[0];
      });

      it ("should not allow arrival time to be less than 0", function() {
        arrival = -1;
        process = new Process(i, arrival, burst, color);
        expect(process).not.toBeCreated();
      });

      it ("should not allow arrival time to be larger than max allowed", function() {
        arrival = PROCESS_MAX_START + 1;
        process = new Process(i, arrival, burst, color);
        expect(process).not.toBeCreated();
      });

      it("should not allow burst time to be less than 0", function() {
        burst = 0;
        process = new Process(i, arrival, burst, color);
        expect(process).not.toBeCreated();
      });

      it("should not allow burst time to be larger than max allowed", function() {
        burst = PROCESS_MAX_LENGTH + 1;
        process = new Process(i, arrival, burst, color);
        expect(process).not.toBeCreated();
      });
    });
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
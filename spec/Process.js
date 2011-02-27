describe("Process", function() {
  var process, process_list;
  var i, arrival, burst, color;

  beforeEach(function() {
    process_list = new ProcessList();
  });

  describe("#new", function() {
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
        expect(process.arrival).toEqual(arrival);
      });

      it("should set burst time", function() {
        expect(process.burst).toEqual(burst);
      });

      it("should set process color", function() {
        expect(process.color).toEqual(color);
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

  describe("#output", function() {
    beforeEach(function() {
      i = 1;
      arrival = 5;
      burst = 10;
      color = process_list.colors[0];
      process = new Process(i, arrival, burst, color);
      process.output();
    });

    it("should have margin", function() {
      expect(process.margin).toEqual(process.arrival * PX_PER_SECOND);
    });

    it("should have width", function() {
      expect(process.width).toEqual(process.burst * PX_PER_SECOND -2);
    });
  });
});
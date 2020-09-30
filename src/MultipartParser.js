function MultipartParser(buffer) {
  if (typeof buffer != "object")
    throw new Error("Buffer must be a valid object.");
  if (buffer === null) throw new Error("Buffer is not null.");
  if (buffer.length < 1) throw new Error("Buffer can not be empty.");

  this.buffer = buffer;
  this.tempLineArray = [];
  this.sliceBeginning = 0;
  this.finalObj = {};
  this.currentBlock = "";
  this.newLineHex = [0x0d, 0x0a];
}

MultipartParser.prototype.parse = function () {
  for (i = 0; i < this.buffer.length; i++) {
    if (
      this.buffer[i] === this.newLineHex[0] ||
      this.buffer[i] === this.newLineHex[1]
    ) {
      this.tempLineArray.push(this.buffer.slice(this.sliceBeginning, i + 1));
      this.sliceBeginning = i + 1;

      if (this.tempLineArray[0].toString().includes("Content-Disposition")) {
        this.setHeaderInfo(this.tempLineArray[0]);
      }

      if (
        this.currentBlock != "" &&
        this.lineIsNecessary(this.tempLineArray[0])
      ) {
        this.finalObj[this.currentBlock].push(this.tempLineArray[0]);
      }

      this.tempLineArray = [];
    }
  }
  return this.removeWhitespace(this.finalObj);
};

MultipartParser.prototype.setHeaderInfo = function (headerLine) {
  if (headerLine.toString().includes("filename")) {
    let formElemName = headerLine
      .toString()
      .split(";")[2]
      .split("=")[1]
      .replace(/"/g, "");
    formElemName = formElemName.replace("\r", "");
    this.finalObj[formElemName] = [];
    this.currentBlock = formElemName;
  } else {
    let formElemName = headerLine
      .toString()
      .split(";")[1]
      .split("=")[1]
      .replace(/"/g, "");
    formElemName = formElemName.replace("\r", "") + ".txt";
    this.finalObj[formElemName] = [];
    this.currentBlock = formElemName;
  }
};

MultipartParser.prototype.lineIsNecessary = function (line) {
  if (line.toString().includes("Content")) {
    return false;
  }
  if (line.toString().includes("----WebKit")) {
    return false;
  }

  return true;
};

MultipartParser.prototype.removeWhitespace = function (obj) {
  Object.keys(obj).forEach((key) => {
    obj[key] = Buffer.concat(obj[key]);
    if (key.includes("txt")) {
      obj[key] = obj[key].slice(3, obj[key].length);
    } else {
      obj[key] = obj[key].slice(4, obj[key].length);
    }
  });
  return obj;
};

module.exports = MultipartParser;

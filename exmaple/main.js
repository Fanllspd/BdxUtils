const BdxReader = require('../ReaderClass');
reader = new BdxReader();
//reader.setLogin(fbToken,serverCode,serverPass);
reader.Read('./test bdx/test22.bdx', (result) => {
    console.log(result);
    console.log(result.blockPalette);
});

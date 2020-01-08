// import async from 'async';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class TestFunction {
    f1() {
        console.log('Teste 3');
        return 'Batata';
    }
    f2() {
    }
}
const teste = () => __awaiter(this, void 0, void 0, function* () {
    const testFunction = new TestFunction();
    let f_par = [];
    f_par.push(testFunction.f1);
    f_par.push(testFunction.f1);
    f_par.push(testFunction.f1);
    Promise.all(f_par.map((f) => __awaiter(this, void 0, void 0, function* () {
        return f();
    }))).then((v) => {
        console.log(v);
        console.log('Teste 1');
    });
    console.log('Teste 2');
    return true;
});
teste();
//# sourceMappingURL=waterfall.js.map
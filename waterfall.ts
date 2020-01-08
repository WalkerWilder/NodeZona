// import async from 'async';

class TestFunction {
    f1() {
        console.log('Teste 3');
        
        return 'Batata'
    }

    f2() {
        
    }
}


const teste = async () => {
    const testFunction = new TestFunction();
    
    let f_par = []
    f_par.push(testFunction.f1);
    f_par.push(testFunction.f1);
    f_par.push(testFunction.f1);
    Promise.all(f_par.map(async (f:Function)=>{
        return f();
    })).then((v)=>{
        console.log(v);
        console.log('Teste 1');
    })
    console.log('Teste 2');
    return true;
}
teste();
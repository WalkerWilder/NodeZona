const sobreviventes = 25;
const populacao = 100;
const correcao = 0.5;
const mutacao = 0.05;
const voltar = false;


var v = 0;
if (voltar) {
	v = 1;
}
var passos = 0;
var a_player = [];
var geracao = 0;
var maxpontuacao = 0;

const randomIntInc = (low, high) => {
	return Math.floor(Math.random() * (high - low + 1) + low)
}

const move = (players, end) => {
	let players_ativos = players.filter((p) => {
		if (p.ativo) return p;
	});

	passos++;

	setTimeout(function () {
		if (players_ativos.length == 0) {
			end();
		} else {
			for (let n = 0; n < players_ativos.length; n++) {
				const player = players_ativos[n];
				if (player.ativo) {
					let top = 0;
					let left = 0;

					if (Math.random() * 100 > player.historico.vetores.y) {
						top = randomIntInc(-20, -1);
					} else {
						top = randomIntInc(1, 20);
					}

					if (Math.random() * 100 > player.historico.vetores.x) {
						left = randomIntInc(-20, -1);
					} else {
						left = randomIntInc(1, 20);
					}

					// if (player.historico.caminho[passos] && Math.random() > mutacao/100 ) {
					// 	top = player.historico.caminho[passos].top;
					// 	left = player.historico.caminho[passos].left;
					// } else {
					// 	top = randomIntInc(-1, v);
					// 	left = randomIntInc(-1, 1);
					// }

					player.top += (top) * 1;
					player.left += (left) * 1;

					$(`#${player.id}`).animate({ 'top': player.top + 'px', 'left': player.left + 'px' }, 0);

					// player.historico.pasos = passos;
					// player.historico.caminho[passos] = { 'top': top, 'left': left };

					if (player.top <= 0 || player.left <= 0 || player.top >= 497 || player.left >= 598) {
						player.ativo = false;
					}
				}
			};
			move(players_ativos, end);
		}
	}, 0);
}

const selecao = (arr) => {
	arr.sort((a, b) => {
		return b.historico.pontos - a.historico.pontos;
	})
	arr.splice(arr.length * (sobreviventes / 100));
	return arr;
}

const reproducao = (arr) => {
	if (arr.length == 0) {
		for (let n = 0; n < populacao; n++) {
			let id = `player${n}`;
			$('#campo').append(`<div class='player' id='${id}'><div>`)
			let player = {
				id: id,
				ativo: true,
				top: 487,
				left: 299,
				historico: {
					passos: 0,
					vetores: {
						y: randomIntInc(0, 100),
						x: randomIntInc(0, 100)
					}
				}
			};
			arr.push(player);
		}
	} else {
		let a_player = [];
		for (let n = 0; n < populacao; n++) {
			let id = `player${n}`;
			$('#campo').append(`<div class='player' id='${id}'><div>`)
			let player = {
				id: id,
				ativo: true,
				top: 487,
				left: 299,
				historico: {
					passos: 0,
					vetores: {}
				}
			};
			if (Math.random() > mutacao / 100) {
				let vetores = arr[randomIntInc(0, arr.length - 1)].historico.vetores;
				vetores.y = vetores.y + randomIntInc(correcao * -1, correcao);
				vetores.x = vetores.x + randomIntInc(correcao * -1, correcao);
				player.historico.vetores = vetores;
			} else {
				let vetores = {};
				vetores.y = randomIntInc(0, 100);
				vetores.x = randomIntInc(0, 100);
				player.historico.vetores = vetores;
			}
			a_player.push(player);
		}
		arr = a_player;
	}

	return arr;
}

const novageracao = async () => {
	const posChegada = $('#chegada').position();
	const topChegada = posChegada.top;
	const leftChegada = posChegada.left;
	let maxAtual = 0;
	let soma = 0;
	for (let i = 0; i < a_player.length; i++) {
		const player = a_player[i];
		const dif = (Math.abs(topChegada - player.top) / 4) + Math.abs(leftChegada - player.left)
		let pontos = 1000 - dif;
		player.historico.pontos = pontos;
		if (pontos > maxAtual) maxAtual = pontos;
		soma += pontos;
	}

	if (maxAtual > maxpontuacao) maxpontuacao = maxAtual;

	console.log(`Máximo atual: ${maxAtual}, Máximo geral: ${maxpontuacao}, Média: ${soma / populacao}`);
	

	for (let i = 0; i < a_player.length; i++) {
		const player = a_player[i];
		$(`#${player.id}`).remove();
	}
	a_player = selecao(a_player);
	a_player = reproducao(a_player);
	geracao++;
	console.log(`Geração ${geracao}`);
	
	await move(a_player, novageracao);
}

$(async () => {
	a_player = reproducao(a_player);
	geracao++;
	console.log(`Geração ${geracao}`);
	await move(a_player, novageracao);
});
const fetch = require('node-fetch');

const addressToName = {
	"terra15gwkyepfc6xgca5t5zefzwy42uts8l2m4g40k6" : 'MIR',
	 "terra1qelfthdanju7wavc5tq0k5r0rhsyzyyrsn09qy" : 'mAMC',
	 "terra19cmt6vzvhnnnfsmccaaxzy2uaj06zjktu6yzjx" : 'mVIXY',
	 "terra1kscs6uhrqwy6rx5kuw5lwpuqvm3t6j2d6uf2lp" : 'mSLV',
	 "terra10h7ry7apm55h4ez502dqdv9gr53juu85nkd4aq": 'mIAU',
	 "terra1l5lrxtwd98ylfy09fn866au6dp76gu8ywnudls": 'mGLXY',
	"terra1g4x2pzmkc9z3mseewxf758rllg08z3797xly0n" : 'mABNB',
	 "terra1h8arz2k547uvmpxctuwush3jzc8fun4s96qgwt": 'mGOOGL',
	 "terra1m6j6j9gw728n82k78s0j9kq8l5p6ne0xcc820p": 'mGME',
	 "terra1jsxngqasf2zynj5kyh0tgq9mj3zksa5gk35j4k": 'mNFLX',
	 "terra137drsu8gce5thf6jr5mxlfghw36rpljt3zj73v": 'mGS',
	 "terra14y5affaarufk3uscy2vr6pe6w6zqf2wpjzn5sh": 'mTSLA',
	 "terra18wayjpyq28gd970qzgjfmsjj7dmgdk039duhph": 'mCOIN',
	 "terra1dk3g53js3034x4v5c3vavhj2738une880yu6kx": 'mETH',
	 "terra1mqsjugsugfprn3cvgxsrr8akkvdxv2pzc74us7": 'mFB',
	 "terra1cc3enj9qgchlrj34cnzhwuclc4vl2z3jl7tkqg": 'mTWTR',
	 "terra1w7zgkcyt7y4zpct9dw8mw362ywvdlydnum2awa": 'mBABA',
	 "terra1lvmx8fsagy70tv0fhmfzdw9h6s3sy4prz38ugf": 'mUSO',
	 "terra1227ppwxxj3jxz8cfgq00jgnxqcny7ryenvkwj6": 'mMSFT',
	 "terra165nd2qmrtszehcfrntlplzern7zl4ahtlhd5t2": 'mAMZN',
	"terra1vxtwu4ehgzz77mnfwrntyrmgl64qjs75mpwqaz": 'mAAPL',
	 "terra1rhhvx8nzfrx5fufkuft06q5marfkucdqwq5sjw": 'mBTC',
	 "terra1aa00lpfexyycedfg5k2p60l9djcmw0ue5l8fhc": 'mSPY',
	 "terra1csk6tc7pdmpr782w527hwhez6gfv632tyf72cp": 'mQQQ'
}


export default async function getAll(req, res) {
	await fetch("https://graph.mirror.finance/graphql?assetsStats:TERRA", {
	  "headers": {
	    "accept": "*/*",
	    "accept-language": "en-US,en;q=0.9",
		"accept-encoding": "",
	    "content-type": "application/json",
	    "sec-fetch-dest": "empty",
	    "sec-fetch-mode": "cors",
	    "sec-fetch-site": "same-site",
	    "sec-gpc": "1"
	  },
	  "referrer": "https://terra.mirror.finance/",
	  "referrerPolicy": "strict-origin-when-cross-origin",
	  "body": "{\"query\":\"\\n    query assets($network: Network) {\\n      assets {\\n        token\\n        description\\n\\n        statistic {\\n          liquidity(network: $network)\\n          volume(network: $network)\\n          marketCap\\n          collateralValue\\n          minCollateralRatio\\n          apr {\\n            long\\n            short\\n          }\\n        }\\n      }\\n    }\\n  \",\"variables\":{\"network\":\"TERRA\"}}",
	  "method": "POST",
	  "mode": "cors"
	}).then(async (resp) => {
		res.status(200).json(await clean(resp));
	})
	console.log("Finished")
}


const clean = async (res) => {
	// for each of the assets look up the token name
	// add it, the aprs, and the collateralization ratio to the a new array
	const text = await res.text()
	const json = JSON.parse(text);

	return json.data.assets.map((asset) => {
		const name = addressToName[asset.token];

		return {
			name: name,
			minCR: asset.statistic.minCollateralRatio,
			longAPR: asset.statistic.apr.long,
			shortAPR: asset.statistic.apr.short
		}
	})
}

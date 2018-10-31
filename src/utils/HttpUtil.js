import RNFetchBlob from 'react-native-fetch-blob'
import NavigationService from "../components/NavigationService";
// 处理url
function encodeQuery(url, params = {}) {
	let _url = url;
	if (!params || !Object.keys(params).length) {
		return _url;
	}
	_url = _url.indexOf('?') === -1 ? `${_url}?` : `${_url}&`;
	const query = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
	return `${_url}${query}`;
}
// 处理错误请求
function throwError(json) {
	const error = new Error(json);
	error.msg = json.msg;
	error.status = json.status;
	throw error;
}
function checkStatus(resp, json) {
	if (resp.respInfo.status === 200 && resp.respInfo.status < 300) {
		if (json.code == 444) {//未登录跳转登录页
			NavigationService.navigate('Login', { toast: '登陆过期，请重新登录' });
			return
		}
		return json;
	}
	else {
		console.log(resp, json);
		throwError(json);
	}
	return json;
}
// const HOST = 'http://app.aite.com';//测试环境
const HOST = 'http://app.xm.com';//测试环境

export default class HttpRequest {
	static async fetch(method, url, params = {}, config, headers) {
		let _method;
		let _params;
		let _url = HOST + url;
		let token;
		let uid;
		let usertype;
		const _config = { indicator: true, timeout: 30000, trusty: false, ...config };
		try {
			token = await READ_CACHE_ASYNC('token');
		} catch (err) {
			token = null;
		};
		try {
			uid = await READ_CACHE_ASYNC('uid');
		} catch (err) {
			uid = null;
		};
		try {
			usertype = await READ_CACHE_ASYNC('usertype');
		} catch (err) {
			usertype = null;
		};
		let _default = {
			uid,
			usertype,
		};
		const _headers = {
			'Content-Type': 'application/json',
			'User-Agent': 'hai_merchant',
			'token': token,
			...headers
		};
		if (!method) _method = 'GET';
		else _method = method.toUpperCase();

		if (_method === 'GET' && params) {
			_url = encodeQuery(_url, Object.assign(params, _default));
		}

		if (_method === 'POST' && params) {
			_params = JSON.stringify(Object.assign(params, _default));
		}

		if (__DEV__) {
			console.log('_url:', _url);
			// console.log('_params:', _params);
			// console.log('_config:', _config);
			// console.log('_method:', _method);
			// console.log('_header:', _headers);
		}

		return RNFetchBlob
			.config(_config)
			.fetch(_method, _url, _headers, _params)
			.then(resp => {
				// console.log(resp);
				return checkStatus(resp, resp.json());
			})
			.then((response) => {
				return response;
			})
			.catch((error) => {
				throw error;
			});
	}
	static GET(url, params, headers, config) {
		return HttpRequest.fetch('get', url, params, headers, config);
	}

	static POST(url, params, headers, config) {
		return HttpRequest.fetch('post', url, params, headers, config);
	}

	static upload(url, fileName, type, path, _headers, config) {
		const headers = {
			'Content-Type': 'multipart/form-data',
			..._headers
		};
		const _config = { indicator: true, timeout: 30000, trusty: false, ...config };
		let body = [{
			name: 'file',
			filename: fileName,
			type: type,
			data: RNFetchBlob.wrap(path)
		}];
		console.log(RNFetchBlob.wrap(path));
		return RNFetchBlob
			.config(_config)
			.fetch('POST', HOST + url, headers, body)
			.then((response) => response.json())
			.then((response) => {
				// 上传信息返回
				console.log(response);
				return response;
			})
			.catch((error) => {
				// 错误信息
				console.log(error);
				throw error;
			});
	}
}
global.HttpUtil = HttpRequest;
package com.sinoauto.controller.b;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alipay.api.AlipayApiException;
import com.alipay.api.AlipayClient;
import com.alipay.api.DefaultAlipayClient;
import com.alipay.api.domain.AlipayTradeAppPayModel;
import com.alipay.api.internal.util.AlipaySignature;
import com.alipay.api.request.AlipayTradeAppPayRequest;
import com.alipay.api.response.AlipayTradeAppPayResponse;
import com.sinoauto.dao.bean.HqlsFinanceFlow;
import com.sinoauto.entity.ErrorStatus;
import com.sinoauto.entity.RestModel;
import com.sinoauto.service.FinanceFlowService;
import com.sinoauto.service.PurchaseOrderService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author fujl
 * @version 1.0
 * @date 2017-08-28 16:07:24
 */
@Api(tags = "支付宝服务端SDK")
@RestController
public class AliPayController {

	private String APP_ID = "2017082308336815";
	private String APP_PUBLIC_KEY = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmivkzB82uSI+vgCC2DLf1oi5Vp9BBC6yzt0RqjPtVSovo/g7Pa1o1jM/JSoN87MiwlyLnp52OOOSAvuO2XYra168JQvN290cuAQOGAbHLTUgQ4e1bs2DDIWu4chkAFmJ3F419AzMfFhMPySz8ujdvdOi9xxW7yf5EfXjKO9TtvAqTItxmjJHvSLWI3ThgbBXt45j+7A+V9fptX25FPeHhvowkqQFI09MUmpuvNwqzxGEaqULbdcqs53oScghknsNKlDRX2n9NELoMeHzbFxz8i6lpD6TOTe5gUScVUvFAzUfl0sjnGGTqcocUa8qdUNUnu4GtTv1uqi1NR3hlnLmTQIDAQAB";
	private String APP_PRIVATE_KEY = "MIIEwAIBADANBgkqhkiG9w0BAQEFAASCBKowggSmAgEAAoIBAQCaK+TMHza5Ij6+AILYMt/WiLlWn0EELrLO3RGqM+1VKi+j+Ds9rWjWMz8lKg3zsyLCXIuennY445IC+47ZditrXrwlC83b3Ry4BA4YBsctNSBDh7VuzYMMha7hyGQAWYncXjX0DMx8WEw/JLPy6N2906L3HFbvJ/kR9eMo71O28CpMi3GaMke9ItYjdOGBsFe3jmP7sD5X1+m1fbkU94eG+jCSpAUjT0xSam683CrPEYRqpQtt1yqznehJyCGSew0qUNFfaf00Qugx4fNsXHPyLqWkPpM5N7mBRJxVS8UDNR+XSyOcYZOpyhxRryp1Q1Se7ga1O/W6qLU1HeGWcuZNAgMBAAECggEBAIRZrCgDn9Hc8SnhfHIncntUkm8ndgQmJsBpjdGklFjpR06nOgwfwwEnq0y3RpTwMqXSFtYLyQfbbSx8UkyjInEhObk/4fCeaBoc+RBtOS25DsKKTRoa+SaV2OThR9/4/d2dTwn8tssEbihC1OxyNnHQrnUe8g6LLUna4bDxi9deCz6s09cFw3Z9rxxZ5IZWd8GV6VV1GTS7RLLYOi2MoZCJ/8a6UVooJTm36CWhqAOKK1ZhAZHvdqe38hc/rLFXO9qUC0gEB4LPMQaZliOmimt2/1UqarEFQTIXr02+qZBXu9Jx77ZNbS7QUHA1ea7VNMKjz62rDBicRKg8uMqxZcECgYEA5D09afFY1OfPapQMIb4I0KelUNUniIUQBIiIiY70ghyspXmhBZfUmiUUer6vIMScIChoYaBUj69X1IcPymNglesBhZT/dX7anNPuNGYd6e/V5gyvlKMez8uQ+khUzVlAStOvs1fqmOZZk4M846i8Ah2O0cQINt4crLU6HGKULT0CgYEArOxhq77rdxmqOyjJu6nZolqoj+gk22+vGDSxhz5g58UQSEPqUm8eutBkb+NuPa9aayGyX4nz8JQGsYeRejYm6hGFdmhk04eaB3E3CTpzT+9GWSXJNe29R5MgBs3imWfx6Lv0blnIK+ZyXMkDic8Ddpkxuv58SB2uiCGHsktoTlECgYEAv/GMk2sn5K0qbxwgc8QIT8mdKrSH8bTNurJD+UNi94U74FHAjB6a6iNi7LMuPqV6E0VIO0oFs2yntZD8Q519nbasafXbPKm5GgjVG/YBFDrhrP1gL+VaxTASNZncz3FOs18BNRcrsPiPvpGxBFhj/Hd1I43zxojWnpwuSa7RpJUCgYEArDlhraQg8CXnnbQp93ZbA5A3gdw7mTHKudkBVymRakSiytaZcjCp8nXLEoT5LwaOj1SoSu8iveEwKXBUO9vjNgztV9jxUpwjlHX10oMchehRsEgp9kQp2Dd4Fk7H+PHFxX4tHBrfepmyHSc3FvHPCTfah9sd/NVTFtIOTE0+PYECgYEA5DahHQ5wr9L4/WsMF0Wp2sW9j4no7puBhuaLSY/5AFD94lzyRqP6OXNmT30HxE5x3KPlXNyICFBNyKiNjbaM6gbH48ieKa0+8pRTULomtiBfHMRXOyk1pLI5ORYq3Rnqv5yMzXw3Tub+bOTlojs0OeAtxAWNqlq0sTM2BOw4NFU=";
	private String ALIPAY_PUBLIC_KEY = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmWGgE7DqYASLZWLMqto+fBxeZYrZmTm7Rz5L+nhhwuYc0RpajZY69e3gyLuvjbfIsQQYt6SfHi66gs1e/n837uO8C454PAznayHyGoZrfGeM/vRjXSXC8mA3IbEk4F/3z4tXAohfS+sz6GbDTcrq8woz7vKtjgFCDJaxgl6vki69thzCmr8btE3vMNgCLVAJ7NKrTtBxr1YcGz79gyPlbYxsTlLGcxX9R9BrxqtCr1sHYD4+J9GZg+cGumk4TOlgZhxo/ZUZ0g0xLDAN3lUFqjuEMbYDJw/rckugTEmpUxlfmXcmqEcg4PQJvsSuVhI7ymkFrJA1h1RfRrg3k2yxRQIDAQAB";

	@Autowired
	private FinanceFlowService financeFlowService;
	@Autowired
	private PurchaseOrderService purchaseOrderService;
	@Autowired
	HttpServletRequest httpServletRequest;
	@Autowired
	HttpServletResponse httpServletResponse;

	@ApiOperation(value = "生成支付订单", notes = "fujl")
	@PostMapping("/alipay/generateorder")

	@ApiImplicitParams({ @ApiImplicitParam(paramType = "query", name = "storeId", value = "门店ID", dataType = "Integer", required = true),
			@ApiImplicitParam(paramType = "query", name = "orderNo", value = "订单号", dataType = "String", required = false),
			@ApiImplicitParam(paramType = "query", name = "money", value = "支付金额", dataType = "Double", required = true),
			@ApiImplicitParam(paramType = "query", name = "changeType", value = "金额变动类型：1充值；2提现；3采购；4汽车维护服务", dataType = "Integer", required = true) })
	public ResponseEntity<RestModel<String>> generatePayOrder(Integer storeId, String orderNo, Double money, Integer changeType) {
		String subject = "";
		if (1 == changeType) {
			subject = "华汽连锁账户充值";
			orderNo = String.format("CZ%d%s", storeId, new SimpleDateFormat("yyyyMMddhhmmssSSS").format(new Date()));
		} else if (3 == changeType) {
			subject = "华汽连锁订单支付";
		} else {
			return RestModel.error(HttpStatus.INTERNAL_SERVER_ERROR, ErrorStatus.SYSTEM_EXCEPTION);
		}

		// 实例化客户端
		AlipayClient alipayClient = new DefaultAlipayClient("https://openapi.alipay.com/gateway.do", APP_ID, APP_PRIVATE_KEY, "json", "UTF-8",
				APP_PUBLIC_KEY, "RSA2");
		// 实例化具体API对应的request类,类名称和接口名称对应,当前调用接口名称：alipay.trade.app.pay
		AlipayTradeAppPayRequest request = new AlipayTradeAppPayRequest();
		// SDK已经封装掉了公共参数，这里只需要传入业务参数。以下方法为sdk的model入参方式(model和biz_content同时存在的情况下取biz_content)。
		AlipayTradeAppPayModel model = new AlipayTradeAppPayModel();
		model.setBody(subject);
		model.setSubject(subject);
		model.setOutTradeNo(orderNo);
		model.setTimeoutExpress("30m");
		model.setTotalAmount(String.valueOf(money));
		model.setProductCode("QUICK_MSECURITY_PAY");
		request.setBizModel(model);
		request.setNotifyUrl("http://42.159.202.20:8881/alipay/notify");
		this.financeFlowService.insertRechargeFlow(storeId, money, changeType, orderNo);
		try {
			// 这里和普通的接口调用不同，使用的是sdkExecute
			AlipayTradeAppPayResponse response = alipayClient.sdkExecute(request);
			return RestModel.success(response.getBody());// 就是orderString 可以直接给客户端请求，无需再做处理。
		} catch (AlipayApiException e) {
			e.printStackTrace();
		}
		return RestModel.error(HttpStatus.INTERNAL_SERVER_ERROR, ErrorStatus.SYSTEM_EXCEPTION);
	}

	@ApiIgnore
	@ApiOperation(value = "回调函数", notes = "fujl")
	@PostMapping("/alipay/notify")
	public void aliPayNotify() {
		// 获取支付宝POST过来反馈信息
		Map<String, String> params = new HashMap<String, String>();
		Map<String, String[]> requestParams = httpServletRequest.getParameterMap();
		for (Iterator<String> iter = requestParams.keySet().iterator(); iter.hasNext();) {
			String name = (String) iter.next();
			String[] values = (String[]) requestParams.get(name);
			String valueStr = "";
			for (int i = 0; i < values.length; i++) {
				valueStr = (i == values.length - 1) ? valueStr + values[i] : valueStr + values[i] + ",";
			}
			// 乱码解决，这段代码在出现乱码时使用。
			// valueStr = new String(valueStr.getBytes("ISO-8859-1"), "utf-8");
			params.put(name, valueStr);
		}
		String transactionNo = "";
		double money = 0;
		for (String key : params.keySet()) {
			if (StringUtils.equals("out_trade_no", key)) {
				transactionNo = params.get(key);
			}
			if (StringUtils.equals("total_amount", key)) {
				money = Double.valueOf(params.get(key));
			}
			System.out.println(String.format("%s : %s", key, params.get(key)));
		}
		// 切记alipaypublickey是支付宝的公钥，请去open.alipay.com对应应用下查看。
		// boolean AlipaySignature.rsaCheckV1(Map<String, String> params, String publicKey, String charset, String sign_type)
		try {
			boolean flag = AlipaySignature.rsaCheckV1(params, ALIPAY_PUBLIC_KEY, "UTF-8", "RSA2");
			if (flag) {
				synchronized (transactionNo) {
					HqlsFinanceFlow flow = this.financeFlowService.findFlowByTransactionNo(transactionNo);
					if (null != flow) {
						if (1 == flow.getChangeType()) {
							Integer affectRow = this.financeFlowService.updateFlowStatus(transactionNo, 1);
							if (null != affectRow && affectRow != 0) {
								this.financeFlowService.updateBalance(money, transactionNo);
							}
						} else if (3 == flow.getChangeType()) {
							Integer affectRow = this.purchaseOrderService.updatePurchaseOrderStatus(transactionNo);
							if (null != affectRow && affectRow != 0) {
								this.financeFlowService.updateFlowStatus(transactionNo, 1);
							}
						}
					}
					try {
						httpServletResponse.getWriter().print("success");
					} catch (IOException e) {
						e.printStackTrace();
					}
				}
			}
			System.out.println("验证结果: " + flag);
		} catch (AlipayApiException e) {
			e.printStackTrace();
		}
	}

}

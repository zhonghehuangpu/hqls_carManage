package com.sinoauto.dto;

import io.swagger.annotations.ApiModelProperty;

public class UserLoginDto {

	@ApiModelProperty("用户ID")
	private Integer userId;
	@ApiModelProperty("用户名")
	private String userName;
	@ApiModelProperty("token")
	private String token;
	@ApiModelProperty("手机号")
	private String mobile;
	@ApiModelProperty("门店ID")
	private Integer storeId;
	@ApiModelProperty("门店信息")
	private StoreDto store;

	public Integer getUserId() {
		return userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		if (userName != null) {
			this.userName = userName;
		}
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		if (token != null) {
			this.token = token;
		}
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		if (mobile != null) {
			this.mobile = mobile;
		}
	}

	public Integer getStoreId() {
		return storeId;
	}

	public void setStoreId(Integer storeId) {
		if (storeId != null) {
			this.storeId = storeId;
		}
	}

	public StoreDto getStore() {
		return store;
	}

	public void setStore(StoreDto store) {
		if (store != null) {
			this.store = store;
		}
	}

}

package com.sinoauto.dto;

import java.util.List;
import io.swagger.annotations.ApiModelProperty;

/**
 *	配件树形菜单递归查询dto
 *	@author liud
 *	@Date2017年8月19日上午11:04:53
 *
 */
public class PartsTreeRecursionDto {
	@ApiModelProperty("配件ID")
	private Integer id;
	@ApiModelProperty("配件名称")
	private String name;
	private List<PartsTreeRecursionDto> children;
	
	
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public List<PartsTreeRecursionDto> getChildren() {
		return children;
	}
	public void setChildren(List<PartsTreeRecursionDto> children) {
		this.children = children;
	}
	
}

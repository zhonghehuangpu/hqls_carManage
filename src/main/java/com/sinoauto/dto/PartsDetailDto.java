package com.sinoauto.dto;

import java.util.List;

import com.sinoauto.dao.bean.HqlsPartsAttrExtr;
import com.sinoauto.dao.bean.HqlsPartsPic;

import io.swagger.annotations.ApiModelProperty;

/**
 * 商品详情
 * @author wuxiao
 * @version 1.0
 * @date 2017-08-16 17:45:22
 */
public class PartsDetailDto {
	@ApiModelProperty("类型ID")
	private Integer partsTypeId;
	@ApiModelProperty("类型名称")
	private String typeName;
	@ApiModelProperty("配件类型")
	private Integer partsType;
	@ApiModelProperty("配件ID")
	private Integer partsId;
	@ApiModelProperty("配件编码")
	private String partsCode;
	@ApiModelProperty("配件名称")
	private String partsName;
	@ApiModelProperty("型号")
	private String partsModel;
	@ApiModelProperty("单位")
	private String partsUnit;
	@ApiModelProperty("规格")
	private String partsSpec;
	@ApiModelProperty("适配车型")
	private String fitModels;
	@ApiModelProperty("配件品牌名称")
	private String partsBrandName;
	@ApiModelProperty("配件品牌Id")
	private Integer partsBrandId;
	@ApiModelProperty("厂家")
	private String partsFactory;
	@ApiModelProperty("产地")
	private String origin;
	@ApiModelProperty("保质期")
	private String shelfLife;
	@ApiModelProperty("价格")
	private Double price;
	@ApiModelProperty("折扣")
	private Double discount;
	@ApiModelProperty("现价")
	private Double curPrice;
	@ApiModelProperty("是否上架")
	private Integer isUsable;
	@ApiModelProperty("轮播图")
	private List<HqlsPartsPic> partsPicList;
	@ApiModelProperty("动态属性")
	private List<HqlsPartsAttrExtr> partsAttrExtrs;

	public Integer getPartsId() {
		return partsId;
	}

	public void setPartsId(Integer partsId) {
		if (partsId != null) {
			this.partsId = partsId;
		}
	}

	public String getPartsName() {
		return partsName;
	}

	public void setPartsName(String partsName) {
		if (partsName != null) {
			this.partsName = partsName;
		}
	}

	public String getPartsModel() {
		return partsModel;
	}

	public void setPartsModel(String partsModel) {
		if (partsModel != null) {
			this.partsModel = partsModel;
		}
	}

	public String getPartsUnit() {
		return partsUnit;
	}

	public void setPartsUnit(String partsUnit) {
		if (partsUnit != null) {
			this.partsUnit = partsUnit;
		}
	}

	public String getPartsSpec() {
		return partsSpec;
	}

	public void setPartsSpec(String partsSpec) {
		if (partsSpec != null) {
			this.partsSpec = partsSpec;
		}
	}

	public String getPartsBrandName() {
		return partsBrandName;
	}

	public void setPartsBrandName(String partsBrandName) {
		if (partsBrandName != null) {
			this.partsBrandName = partsBrandName;
		}
	}

	public String getPartsFactory() {
		return partsFactory;
	}

	public void setPartsFactory(String partsFactory) {
		if (partsFactory != null) {
			this.partsFactory = partsFactory;
		}
	}

	public String getOrigin() {
		return origin;
	}

	public void setOrigin(String origin) {
		if (origin != null) {
			this.origin = origin;
		}
	}

	public String getShelfLife() {
		return shelfLife;
	}

	public void setShelfLife(String shelfLife) {
		if (shelfLife != null) {
			this.shelfLife = shelfLife;
		}
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		if (price != null) {
			this.price = price;
		}
	}

	public Double getDiscount() {
		return discount;
	}

	public void setDiscount(Double discount) {
		if (discount != null) {
			this.discount = discount;
		}
	}

	public Double getCurPrice() {
		return curPrice;
	}

	public void setCurPrice(Double curPrice) {
		if (curPrice != null) {
			this.curPrice = curPrice;
		}
	}

	public List<HqlsPartsPic> getPartsPicList() {
		return partsPicList;
	}

	public void setPartsPicList(List<HqlsPartsPic> partsPicList) {
		if (partsPicList != null) {
			this.partsPicList = partsPicList;
		}
	}

	public List<HqlsPartsAttrExtr> getPartsAttrExtrs() {
		return partsAttrExtrs;
	}

	public void setPartsAttrExtrs(List<HqlsPartsAttrExtr> partsAttrExtrs) {
		this.partsAttrExtrs = partsAttrExtrs;
	}

	public String getPartsCode() {
		return partsCode;
	}

	public void setPartsCode(String partsCode) {
		this.partsCode = partsCode;
	}

	public Integer getPartsBrandId() {
		return partsBrandId;
	}

	public void setPartsBrandId(Integer partsBrandId) {
		this.partsBrandId = partsBrandId;
	}

	public Integer getIsUsable() {
		return isUsable;
	}

	public void setIsUsable(Integer isUsable) {
		this.isUsable = isUsable;
	}

	public Integer getPartsType() {
		return partsType;
	}

	public void setPartsType(Integer partsType) {
		this.partsType = partsType;
	}

	public Integer getPartsTypeId() {
		return partsTypeId;
	}

	public void setPartsTypeId(Integer partsTypeId) {
		this.partsTypeId = partsTypeId;
	}

	public String getTypeName() {
		return typeName;
	}

	public void setTypeName(String typeName) {
		this.typeName = typeName;
	}

	public String getFitModels() {
		return fitModels;
	}

	public void setFitModels(String fitModels) {
		this.fitModels = fitModels;
	}
	
}

package com.sinoauto.dao.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import com.sinoauto.dao.bean.HqlsPartsPic;

@Mapper
public interface PartsPicMapper {

	@Select("select url from hqls_parts_pic where parts_id = #{1} order by sorting limit 0,1")
	public String getFirstUrlByPartsId(Integer partsId);
	
	/**
	 *  查询配件对应的图片
	 * 	@User liud
	 * 	@Date 2017年8月21日下午2:27:57
	 * 	@param partsId
	 * 	@return
	 */
	@Select("select * from hqls_parts_pic where parts_id = #{1} order by sorting")
	public List<HqlsPartsPic> findPartsPicsByPartsId(Integer partsId);
	
	@Select("select * from hqls_parts_pic where parts_id = #{1} order by sorting limit 0,5")
	public List<HqlsPartsPic> findPartsPicsLimit5ByPartsId(Integer partsId);
	
	/**
	 *  新增商品图片
	 * 	@User liud
	 * 	@Date 2017年8月17日下午4:08:24
	 * 	@param hqlsPartsPic
	 */
	public void insert(HqlsPartsPic hqlsPartsPic);
	
	/**
	 *  删除配件id对应的所有图片
	 * 	@User liud
	 * 	@Date 2017年8月17日下午4:40:57
	 * 	@param partsId
	 */
	public void delete(@Param("partsId")Integer partsId);
}
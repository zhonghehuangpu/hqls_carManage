package com.sinoauto.dao.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import com.sinoauto.dto.CommonDto;

@Mapper
public interface CarBrandMapper {

	/**
	 * 查询所有品牌信息
	 * @return
	 */
	@Select("SELECT brand.brand_id AS `key`, brand.brand_name AS `value` FROM hqls_car_brand AS brand WHERE dml_flag <> -3")
	public List<CommonDto> findAllBrands();
	
	/**
	 * 根据品牌Id查询车系
	 * @param brandId
	 * @return
	 */
	@Select("SELECT series.series_id AS `key`, series.series_name AS `value` FROM hqls_car_series AS series WHERE series.brand_id = #{brandId} AND dml_flag <> -3")
	public List<CommonDto> findSeriesByBrandId(@Param("brandId") Integer brandId);
	
	/**
	 * 根据车系Id查询车型
	 * @param brandId
	 * @return
	 */
	@Select("SELECT model.model_id AS `key`, model.model_name AS `value` FROM hqls_car_model AS model WHERE model.series_id = #{seriesId} AND dml_flag <> -3")
	public List<CommonDto> findModelsBySeriesId(@Param("seriesId") Integer seriesId);
	
}
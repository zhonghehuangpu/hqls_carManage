package com.sinoauto.dto;

public class AuthorityDto {

	private Integer id;
	private String name;
	private Integer pId;
	private Boolean checked;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		if (id != null) {
			this.id = id;
		}
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		if (name != null) {
			this.name = name;
		}
	}

	public Integer getpId() {
		return pId;
	}

	public void setpId(Integer pId) {
		if (pId != null) {
			this.pId = pId;
		}
	}

	public Boolean getChecked() {
		return checked;
	}

	public void setChecked(Boolean checked) {
		if (checked != null) {
			this.checked = checked;
		}
	}

	@Override
	public int hashCode() {
		return this.pId.hashCode()+this.id.hashCode()+this.name.hashCode();
	}

	@Override
	public boolean equals(Object obj) {
		AuthorityDto o = (AuthorityDto) obj;
		return o.pId == this.pId && o.id == this.id && o.name.equals(this.name);
	}
	
	

}

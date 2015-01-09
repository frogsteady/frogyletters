package database.testHibernateSearch.search;

import org.hibernate.search.annotations.*;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

/**
 * The persistent class for the contact database table.
 * 
 */
@Entity
@Indexed
@Table(name = "contact")
public class Contact {
	private Integer id;
	private String name;
	private String email;
    private Date updateDate;
	public Contact() {

	}

	public Contact(Integer id, String name, String email) {
		this.id = id;
		this.name = name;
		this.email = email;
	}

	@Id
	public Integer getId() {
		return this.id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	@Field(index = Index.YES, analyze = Analyze.YES, store = Store.NO)
	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

    public Date getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(Date updateDate) {
        this.updateDate = updateDate;
    }

    @Override
	public String toString() {
		StringBuilder stringBuilder = new StringBuilder("Id: ").append(this.getId()).append(" | Name:").append(this.getName()).append(" | Email:").append(this.getEmail());
		
		return stringBuilder.toString();
	}
}
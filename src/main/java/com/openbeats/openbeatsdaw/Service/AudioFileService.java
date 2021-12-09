package com.openbeats.openbeatsdaw.Service;

import com.openbeats.openbeatsdaw.Entity.File;
import com.openbeats.openbeatsdaw.Entity.Session;
import com.openbeats.openbeatsdaw.Repository.FileRepository;
import com.openbeats.openbeatsdaw.model.AudioTrack;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.util.List;

@Service
@Slf4j
public class AudioFileService {

    @Autowired
    FileRepository fileRepository;

    @Autowired
    SessionMgmtService sessionMgmtService;

    public boolean saveAudioFileDetails(String fileName,String userEmail,String fileType,String joinCode,String owner){
        Session session=sessionMgmtService.findSessionByjoinCode(joinCode);
        File file=new File();
        file.setFileName(fileName);
        file.setSessionId(session.getSessionId());
        file.setFileType(fileType);
        file.setUserEmail("abheejeet24");
        file.setArtist_name(owner);
        fileRepository.save(file);

    return true;
    }

    public AudioTrack convertFileToAudioTrack(File file,String joinCode){
        AudioTrack audioTrack=new AudioTrack();
        audioTrack.setAudioTrackId(file.getFileId());
        audioTrack.setSessionId(joinCode);
       audioTrack.setFile(file.getFileName());
    return  audioTrack;
    }

    public List<File> findAllFilesInSession(Long sessionId){
        return fileRepository.findBysessionId(sessionId);
    }


}

package com.openbeats.openbeatsdaw.Service;

import com.openbeats.openbeatsdaw.model.Entity.File;
import com.openbeats.openbeatsdaw.model.Entity.Session;
import com.openbeats.openbeatsdaw.Repository.FileRepository;
import com.openbeats.openbeatsdaw.model.AudioTrack;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class AudioFileService {

    @Autowired
    FileRepository fileRepository;

    @Autowired
    SessionMgmtService sessionMgmtService;

    public File saveAudioFileDetails(String fileName, String userEmail, String fileType, String joinCode, String owner){
        Session session=sessionMgmtService.findSessionByjoinCode(joinCode);
        File file=new File();
        file.setFileName(fileName);
        file.setSessionId(session.getSessionId());
        file.setFileType(fileType);
        file.setUserEmail(userEmail);
        file.setArtist_name(owner);
        File res = fileRepository.save(file);

    return res;
    }

    public boolean updateAudioFileDetails(Long fileId, String fileName){

        File fileDetails = fileRepository.getById(fileId);
        fileDetails.setFileName(fileName);
        fileRepository.save(fileDetails);
        return true;
    }

    public boolean updateAudioFileDisplayName(Long fileId, String newFileDisplayName){

        File fileDetails = fileRepository.getById(fileId);
        fileDetails.setFileDisplayName(newFileDisplayName);
        fileRepository.save(fileDetails);
        return true;
    }

    public boolean updateAudioFileOffset(Long fileId, Integer offset){

        fileRepository.updateFileOffset(fileId, offset);
        return true;
    }

    public AudioTrack convertFileToAudioTrack(File file,String joinCode){
        AudioTrack audioTrack=new AudioTrack();
        audioTrack.setAudioTrackId(file.getFileId());
        audioTrack.setSessionId(joinCode);
       audioTrack.setFile(file.getFileName());
       audioTrack.setOffset(file.getOffset());
    return  audioTrack;
    }

    public List<File> findAllFilesInSession(Long sessionId){
        return fileRepository.findAllBySessionId(sessionId);
    }

    public boolean deleteByFileId(Long fileId) {
        fileRepository.deleteById(fileId);
        return true;
    }
}
